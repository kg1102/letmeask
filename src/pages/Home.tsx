import { useState } from "react";
import { useHistory } from "react-router-dom";
import { FormEvent } from "react";
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import githubIconImg from '../assets/images/github.svg';
import { Button } from '../components/Button';
import '../styles/auth.scss';
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

export function Home(){
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoomWithGoogle() {
        if(!user){
            await signInWithGoogle();
        }
        history.push('/rooms/new');
    }

    async function handleCreateRoomWithGithub() {
        alert('Por enquanto o login via github se encontra desativado!');
        return;
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();
        if(roomCode.trim() === ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        if(!roomRef.exists()) {
            alert('Room does not exists.');
            return;
        }
        if(roomRef.val().endedAt){
            alert('Room already closed.');
            return;
        }
        history.push(`/rooms/${roomCode}`);
    }


    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"/>                
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask"/>
                    <button onClick={handleCreateRoomWithGoogle} className="create-room-google">
                        <img src={googleIconImg} alt="Logo do google"/>
                        Crie sua sala com o Google
                    </button>
                    <button onClick={handleCreateRoomWithGithub} className="create-room-github">
                        <img src={githubIconImg} alt="Logo do github"/>
                        Crie sua sala com o Github
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}