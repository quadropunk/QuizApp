import { Button, Form, FormControl, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Badge, Container, ListGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getCreatedQuizzesByUser, getCurrentUser, getPassedQuizzesByUser, getUserByUsername } from "./api";

export const Profile = () => {
    const [currentUser, setCurrentUser] = useState();
    const [user, setUser] = useState();
    const [createdQuizzes, setCreatedQuizzes] = useState([]);
    const [passedQuizzes, setPassedQuizzes] = useState([]);
    const [modal, setModal] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    const { username } = useParams();

    useEffect(() => {
        getCurrentUser().then(res => setCurrentUser(res.data));
        getUserByUsername(username).then(res => setUser(res.data));
        getCreatedQuizzesByUser(username).then(res => setCreatedQuizzes(res?.data));
        getPassedQuizzesByUser(username).then(res => setPassedQuizzes(res?.data));
    }, []);

    const renderCreatedQuizzes = (quizzes) => {
        if (quizzes.length !== 0) {
            let quizzesMarkUp = quizzes.map((quiz, index) => {
                return (
                    <ListGroup.Item
                        key={index}
                        as="li"
                        className="d-flex justify-content-between align-items-start"
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">
                                {quiz.title}
                            </div>
                            Author: {"user01"}
                        </div>
                        <Badge bg="light">
                            passed: {quiz.passed}
                        </Badge>
                    </ListGroup.Item>)
            });
            return (<>
                <h3>Created Quizzes:</h3>
                <ListGroup>
                    {quizzesMarkUp}
                </ListGroup>
            </>
            );
        }
    }

    const renderPassedQuizzes = (quizzes) => {
        if (quizzes.length !== 0) {
            let quizzesMarkUp = quizzes.map((quiz, index) => {
                return (
                    <ListGroup.Item
                        key={index}
                        as="li"
                        className="d-flex justify-content-between align-items-start"
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">
                                {quiz.title}
                            </div>
                            Author: {"user01"}
                        </div>
                        <Badge bg="light">
                            passed: {quiz.passed}
                        </Badge>
                    </ListGroup.Item>)
            });
            return (<>
                <h3>Passed Quizzes:</h3>
                <ListGroup>
                    {quizzesMarkUp}
                </ListGroup>
            </>
            );
        }
    }

    const createQuiz = e => {
        console.log(e.target.question0.value);
    }

    const updateQuestionName = (index, name) => {
        let qs = [...questions];
        let q = { ...qs[index] };
        q.name = name;
        qs[index] = q;
        setQuestions(qs);
    }

    const updateAnswerContent = (index, content) => {
        let as = [...answers];
        let a = { ...as[index] };
        a.content = content;
        as[index] = a;
        setAnswers(as);
    }

    const renderModal = modal => {
        return (
            <Modal show={modal}>
                <h2>New quiz</h2>
                <Form onSubmit={e => createQuiz(e)}>
                    <Modal.Body>
                        <FormControl
                            placeholder="name"
                            className="me-2"
                            name="name" />
                        <FormControl
                            placeholder="description"
                            className="me-2 mt-3"
                            name="description" />
                        {questions.map((_, q_index) => {
                            return <div className="ml-2">
                                <FormControl
                                    key={q_index}
                                    placeholder={`question${q_index}`}
                                    className="me-2 mt-3"
                                    name={`question${q_index}`}
                                    onChange={e => { updateQuestionName(q_index, e.target.value) }}
                                />
                                <Button onClick={() => {setAnswers(answers => [...answers, { questionId: q_index }])}} variant="success" className="mt-2">Add answer</Button>
                                {answers.filter(a => a.questionId === q_index).map((_, a_index) => {
                                    return <div className="ml-2">
                                        <FormControl
                                            key={a_index}
                                            placeholder={`answer${q_index}${a_index}`}
                                            className="me-2 mt-3"
                                            name={`answer${q_index}${a_index}`}
                                            onChange={e => updateAnswerContent(a_index, e.target.value)}
                                        />
                                    </div>
                                })}
                            </div>
                        })}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { setModal(false); setQuestions([]); }}>Cancel</Button>
                        <Button
                            onClick={() => setQuestions(questions => [...questions, {}])}
                        >
                            Add question
                        </Button>
                        {questions.length > 0 ? <Button variant="success" onClick={e => createQuiz(e)}>Create quiz</Button> : <></>}
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }

    const renderUserView = (user, currentUser) => {
        if (user && currentUser) {
            if (user.username === currentUser.username)
                return (
                    <div className="d-flex justify-content-between">
                        <div>
                            <div>Username: {user.username}</div>
                            <div>{user.email ? `Email: ${user.email}` : ""}</div>
                        </div>
                        <div>
                            <Button onClick={() => setModal(true)}>Create quiz</Button>
                        </div>
                    </div>
                )
            if (user)
                return (
                    <div>
                        <div>Username: {user.username}</div>
                        <div>{user.email ? `Email: ${user.email}` : ""}</div>
                    </div>
                );
            return <div>Nothing to show</div>
        }
    }

    return (
        <Container style={{ marginTop: "100px" }}>
            <div className="mb-3">{renderUserView(user, currentUser)}</div>
            <div className="mt-3">{renderPassedQuizzes(passedQuizzes)}</div>
            <div className="mt-3">{renderCreatedQuizzes(createdQuizzes)}</div>
            {renderModal(modal)}
        </Container>
    );
}