import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import '../styles/room.scss'
import { useEffect, useState } from 'react';
import SyncLoader from 'react-spinners/SyncLoader';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);

    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        setLoading(true);
        setTimeout(()=>{
            setLoading(false);
        }, 5000)
    }, [])

    async function handleEndRoom() {
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        });
        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        }); 
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        }); 
    }

    return (
        <div id="page-room">
        {
        loading ? 
            <>
                <header>
                    <div className="content">
                        <img src={logoImg} alt="Letmeask"/>
                        <div>
                            <RoomCode code={params.id}/>
                            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                        </div>
                    </div>
                </header>
                <div className="loading">
                    <SyncLoader 
                        size={15}
                        color={"#F37A24"}
                        loading={loading}
                    />
                    <h3>Carregando...</h3>
                    <span>"O único homem que está isento de erros, é aquele que não arrisca acertar." - Albert Einstein</span>
                </div>
            </>
        :
            <>
                <header>
                    <div className="content">
                        <img src={logoImg} alt="Letmeask"/>
                        <div>
                            <RoomCode code={params.id}/>
                            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                        </div>
                    </div>
                </header>
                <main className="content">
                    <div className="room-title">
                        <h1>Sala {title}</h1>
                        {questions.length > 0 && <span>{questions.length} perguntas</span>}
                    </div>
                    <div className="question-list">
                        {questions.length === 0 && (
                            <div>
                                <h1>Nenhuma pergunta por aqui...</h1>
                                <span>Envie o código desta sala para seus amigos e comece a responder perguntas!</span>
                            </div>
                        )}
                        {questions.map(question => {
                            return (
                                <Question
                                    key={question.id}
                                    content={question.content}
                                    author={question.author}
                                    isAnswered={question.isAnswered}
                                    isHighlighted={question.isHighlighted}
                                >
                                    {!question.isAnswered && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={()=> handleCheckQuestionAsAnswered(question.id)}
                                            >
                                                <img src={checkImg} alt="Marcar pergunta como respondida"/>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={()=> handleHighlightQuestion(question.id)}
                                            >
                                                <img src={answerImg} alt="Dar destaque à pergunta"/>
                                            </button>
                                        </>
                                    )}
                                    <button
                                        type="button"
                                        onClick={()=> handleDeleteQuestion(question.id)}
                                    >
                                        <img src={deleteImg} alt="Remover pergunta"/>
                                    </button>
                                </Question>
                            );
                        })}
                    </div>
                </main>
            </>
        }
        </div>
    )
}