import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, getDocs, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth } from "../firebase/firebase";
import './Dashboard.css';
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

    // Fetch lists from Firestore where the user is part of the "users" field
    useEffect(() => {
        const fetchLists = async (userUID) => {
            try {
                // Reference to the "lists" collection
                const listsRef = collection(db, "lists");

                // Fetch all documents in the "lists" collection
                const snapshot = await getDocs(listsRef);

                // Filter documents where the "users" field includes the current user's UID
                const listsData = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(list => list.users && list.users.includes(userUID));

                // Update state with filtered lists
                setLists(listsData);
            } catch (error) {
                console.error("Error fetching lists:", error.message);
            }
        };

        // Check if a user is logged in using onAuthStateChanged
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Pass the UID to fetchLists
                const userUID = user.uid;
                fetchLists(userUID); 
            } else {
                console.warn("No user is logged in.");
            }
        });

        // Cleanup the listener
        return () => unsubscribe();
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
        // Ensure a list name is provided
        if (!newListName) return;

        // Reference to the "lists" collection in Firestore
        const listsRef = collection(db, "lists");

        // Get the current user's UID
        const ownerUID = auth.currentUser?.uid;

        if (!ownerUID) {
            console.error("User not authenticated. Cannot create a list.");
            return;
        }

        // Generate a new document reference to manually control the ID
        const newDocRef = doc(listsRef);

        // Prepare the list data with the additional fields
        const newListData = {
            id: newDocRef.id,           // Use the generated document ID
            name: newListName,          // Name of the list
            owner: ownerUID,            // UID of the owner
            createdAt: new Date(),      // Timestamp when the list was created
            updatedAt: new Date(),      // Timestamp for last update (initially same as createdAt)
            users: [ownerUID],          // List of users with access (initially only the owner)
            favorite: false             // Whether the list is marked as favorite (default: false)
        };

        try {
            // Add the new list to Firestore using the predefined document reference
            await setDoc(newDocRef, newListData);

            // Update the local state with the new list
            setLists([...lists, newListData]);

            // Clear the input field for the list name
            setNewListName("");
        } catch (error) {
            console.error("Error creating list:", error.message);
        }
    };

    // Add a new task
    const addTask = async () => {
        // Ensure a task name and a selected list are provided
        if (!newTaskName || !selectedListId) return;

        // Reference to the "tasks" collection in the selected list
        const tasksRef = collection(db, "lists", selectedListId, "tasks");

        // Generate a new document reference to manually control the ID
        const newDocRef = doc(tasksRef);

        // Prepare the task data with the specified fields
        const newTaskData = {
            id: newDocRef.id,        // Use the generated document ID
            name: newTaskName,       // Name of the task
            createdAt: new Date(),   // Timestamp when the task was created
            updatedAt: new Date(),   // Timestamp for last update (initially same as createdAt)
            date: null,              // Date field, initially null
            description: "",         // Description of the task, initially empty
            completed: false         // Whether the task is completed (default: false)
        };

        try {
            // Add the new task to Firestore using the predefined document reference
            await setDoc(newDocRef, newTaskData);

            // Update the local state with the new task
            setTasks([...tasks, newTaskData]);

            // Clear the input field for the task name
            setNewTaskName("");
        } catch (error) {
            console.error("Error creating task:", error.message);
        }
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
        <div className="page-container">
            <Navbar buttonText="Cerrar Sesión" />

            <div className="content-wrap">
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
            </div>

            <Footer />
        </div>
    );
}

export default Tasks;
