import * as React from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Modal,CircularProgress} from '@material-ui/core';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button } from '@material-ui/core';
import Swal from 'sweetalert2';
import {useQuery,useMutation} from '@apollo/client';
import gql from 'graphql-tag'
import ReactLoading from 'react-loading';



const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            textAlign: 'center',
        },
        parent: {
            textAlign: 'center'
        },
        dataDisplay: {
            backgroundColor: '#eeeeee',
            marginBottom: '10px'
        },
        textField: {
            width: '100%',
            textAlign: 'center',
        },
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }),
);

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        alignItems: "center", justifyContent: "center" 
    };
}

const getTodos=gql`
  {
    todos{
        id
        title
      }
  }
`


const addTask=gql`
  mutation CreateATodo($title:String!) {
   addTodo(title:$title){
    title
  }
}
`

const deleteTask=gql`
  mutation DeleteATodo($id:String!) {
   deleteTodo(id:$id){
    title
  }
}
`
const updateTask=gql`
mutation UpdateteATodo($id:String!,$title:String) {
   updateTodo(id:$id,title:$title){
    title
  }
}
`

export interface TodosProps {

}
const schema = Yup.object({
    todo: Yup.string()
        .required('Add an item')
        .min(4, 'Must be greater than or equals to 4 characters')
});

export interface Todo{
    title:String,
    id:String
}

const Todos: React.SFC<TodosProps> = () => {
    const classes=useStyles();
    const {loading,error,data,refetch} = useQuery(getTodos);
    const [todos,setTodos]=React.useState(data);
    const [todo,setTodo]=React.useState('');
    const [open, setOpen] = React.useState(false);
    const [modalStyle] = React.useState(getModalStyle);
    const [currentId, setCurrentId] = React.useState(null);
    const [currentTitle,setCurrentTitle]=React.useState('');

    const [addTodo] = useMutation(addTask)
    const [deleteTodo] = useMutation(deleteTask)
    const [updateTodo] = useMutation(updateTask)



    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return(
        <div>
             <div>
                <Formik
                    initialValues={{ todo: todo }}
                    validationSchema={schema}
                    onSubmit={(value, { resetForm }) => {
                        console.log('todo', value.todo)
                        setTodo('')
                        addTodo({variables:{title:value.todo},refetchQueries: [{ query: getTodos }],});
                        resetForm();
                        setCurrentId(null);
                    }}

                >
                    {(formik: any) => (
                        <Form onSubmit={formik.handleSubmit}>
                            <Grid container justify="center">
                                <Grid item xs={12} sm={4}>
                                    <div>
                                        <Field
                                            type='todo'
                                            as={TextField}
                                            variant="outlined"
                                            label="Todo"
                                            name="todo"
                                            id="todo"
                                            className={classes.textField}
                                        />
                                        <br />
                                        <ErrorMessage name='todo' render={(msg: string) => (
                                            <span style={{ color: "red", fontSize: '18sp' }}>{msg}</span>
                                        )} />
                                        <br />
                                    </div>

                                    <div>
                                        <Button variant="contained" color="primary" type="submit" className={classes.textField} >
                                            Add Todo
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </Form>
                    )}

                </Formik>
            </div>



            {loading &&<CircularProgress />}
            {data &&  <Grid container justify="center">
                <Grid item xs={12} sm={4}>
                    {
                        <List>
                            {data.todos.map(todo => (
                                <ListItem key={todo.id} className={classes.dataDisplay}>
                                    <ListItemText
                                        primary={todo.title}
                                    />
                                    <ListItemSecondaryAction>
                                        <Modal
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="simple-modal-title"
                                            aria-describedby="simple-modal-description"
                                        >
                                            <div style={modalStyle} className={classes.paper}>
                                                <Formik
                                                    initialValues={{ todo: currentTitle }}
                                                    validationSchema={schema}
                                                    onSubmit={(value, { resetForm }) => {
                                                        console.log('todo', value.todo)
                                                        // updateTodo(currentId, value.todo)
                                                        updateTodo({variables:{
                                                            id:currentId,
                                                            title:value.todo
                                                        },
                                                        refetchQueries: [{ query: getTodos }],
                                                    })
                                                        resetForm();
                                                        setCurrentId(null);
                                                        setCurrentTitle('');
                                                        handleClose();
                                                        Swal.fire({
                                                            position: 'center',
                                                            icon: 'success',
                                                            title: 'A todo is updated',
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                          })
                                                    }}

                                                >
                                                    {(formik: any) => (
                                                        <Form onSubmit={formik.handleSubmit}>
                                                            <Grid container justify="center">
                                                                <Grid item xs={12}>
                                                                    <div>
                                                                        <Field
                                                                            type='todo'
                                                                            as={TextField}
                                                                            variant="outlined"
                                                                            label="Todo"
                                                                            name="todo"
                                                                            id="todo"
                                                                            className={classes.textField}
                                                                        />
                                                                        <br />
                                                                        <ErrorMessage name='todo' render={(msg: string) => (
                                                                            <span style={{ color: "red", fontSize: '18sp' }}>{msg}</span>
                                                                        )} />
                                                                        <br />
                                                                    </div>

                                                                    <div>
                                                                        <Button variant="contained" color="primary" type="submit" className={classes.textField} >
                                                                            Update Todo
                                                                         </Button>
                                                                    </div>
                                                                </Grid>
                                                            </Grid>
                                                        </Form>
                                                    )}

                                                </Formik>
                                            </div>
                                        </Modal>
                                        <IconButton edge="end" aria-label="delete" onClick={() => {
                                            console.log('Update Button', todo.id);
                                            setTodo(todo.title);
                                            setCurrentId(todo.id)
                                            setCurrentTitle(todo.title)
                                            handleOpen()
                                        }}>
                                            <CreateOutlinedIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={async () => {
                                            deleteTodo({
                                                variables:{
                                                    id:todo.id
                                                },
                                                refetchQueries: [{ query: getTodos }],
                                            })
                                            Swal.fire({
                                                position: 'center',
                                                icon: 'success',
                                                title: 'A todo is deleted',
                                                showConfirmButton: false,
                                                timer: 1500
                                              })
                                        }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>))}
                        </List>
                    }
                </Grid>
            </Grid>
}
            {error && <div>error:</div>}
            
        </div>
    )

}

export default Todos;