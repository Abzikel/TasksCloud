import React, { useState, useEffect } from "react";
import { getFirestore, collection, doc, addDoc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { auth } from "./firebase/firebase"; // Importa tu configuración de Firebase
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBInput,
    MDBListGroup,
    MDBListGroupItem
} from "mdb-react-ui-kit";

function Tasks() {
    const [lists, setLists] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedListId, setSelectedListId] = useState(null);
    const [newListName, setNewListName] = useState("");
    const [newTaskName, setNewTaskName] = useState("");

    const db = getFirestore();

    // Fetch lists from Firestore
    useEffect(() => {
        const fetchLists = async () => {
            const listsRef = collection(db, "lists");
            const snapshot = await getDocs(listsRef);
            const listsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLists(listsData);
        };

        fetchLists();
    }, [db]);

    // Fetch tasks for the selected list
    const fetchTasks = async (listId) => {
        const tasksRef = collection(db, "lists", listId, "tasks");
        const snapshot = await getDocs(tasksRef);
        const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksData);
    };

    // Add a new list
    const addList = async () => {
        if (!newListName) return;
        const listsRef = collection(db, "lists");
        const docRef = await addDoc(listsRef, { name: newListName });
        setLists([...lists, { id: docRef.id, name: newListName }]);
        setNewListName("");
    };

    // Add a new task
    const addTask = async () => {
        if (!newTaskName || !selectedListId) return;
        const tasksRef = collection(db, "lists", selectedListId, "tasks");
        const docRef = await addDoc(tasksRef, { name: newTaskName });
        setTasks([...tasks, { id: docRef.id, name: newTaskName }]);
        setNewTaskName("");
    };

    // Delete a task
    const deleteTask = async (taskId) => {
        const taskRef = doc(db, "lists", selectedListId, "tasks", taskId);
        await deleteDoc(taskRef);
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    // Select a list
    const selectList = (listId) => {
        setSelectedListId(listId);
        fetchTasks(listId);
    };

    return (
        <MDBContainer className="my-5">
            <MDBRow>
                <MDBCol md="4">
                    <h4>Listas</h4>
                    <MDBListGroup>
                        {lists.map((list) => (
                            <MDBListGroupItem
                                key={list.id}
                                active={list.id === selectedListId}
                                onClick={() => selectList(list.id)}
                                style={{ cursor: "pointer" }}
                            >
                                {list.name}
                            </MDBListGroupItem>
                        ))}
                    </MDBListGroup>
                    <MDBInput
                        label="Nueva lista"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="my-3"
                    />
                    <MDBBtn onClick={addList} block>
                        Agregar lista
                    </MDBBtn>
                </MDBCol>

                <MDBCol md="8">
                    <h4>Tareas</h4>
                    {selectedListId ? (
                        <>
                            <MDBListGroup>
                                {tasks.map((task) => (
                                    <MDBListGroupItem key={task.id}>
                                        {task.name}
                                        <MDBBtn
                                            size="sm"
                                            color="danger"
                                            style={{ float: "right" }}
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            Eliminar
                                        </MDBBtn>
                                    </MDBListGroupItem>
                                ))}
                            </MDBListGroup>
                            <MDBInput
                                label="Nueva tarea"
                                value={newTaskName}
                                onChange={(e) => setNewTaskName(e.target.value)}
                                className="my-3"
                            />
                            <MDBBtn onClick={addTask} block>
                                Agregar tarea
                            </MDBBtn>
                        </>
                    ) : (
                        <p>Selecciona una lista para ver las tareas.</p>
                    )}
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Tasks;
