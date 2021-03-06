import {useContext, useEffect} from "react";
import {PostContext} from "../../contexts/PostContext";
import {AuthContext} from "../../contexts/AuthContext";
import {Button, Card, Col, Row, Spinner, Toast, OverlayTrigger, Tooltip} from "react-bootstrap";
import SinglePost from "../posts/SinglePost";
import AddPostModal from "../posts/AddPostModal";
import addIcon from '../../assets/plus-circle-fill.svg'
import UpdatePostModal from "../posts/UpdatePostModal";

const Dashboard = () => {
    //contexts
    const {
        authState: {user: {username}}
    } = useContext(AuthContext)
    const {
        postState: {post, posts, postLoading},
        getPosts,
        showToast: {show, message, type},
        setShowToast,
        setShowAddPostModal} = useContext(PostContext)
    //start: get all posts
    useEffect(() => getPosts(), [])

    let body = null
    if (postLoading) {
        body = (
            <div className="spinner-container">
                <Spinner animation='border' variant='info'/>
            </div>
        )
    }else if (posts.length === 0){
        body = (
            <>
                <Card className='text-center my-5 mx-5'>
                    <Card.Header as='h1'>
                        Hi {username}
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>Welcome to learnit</Card.Title>
                        <Card.Text>
                            Click the button below to trach your first skill to learn
                        </Card.Text>
                        <Button variant='primary' onClick={setShowAddPostModal.bind(this, true)}>
                            LearnIt
                        </Button>
                    </Card.Body>
                </Card>
            </>
        )
    }else{
        body = (
            <>
                <Row className='row-cols-1 row-cols-md-3 g-4 mx-auto mt-3'>
                    {posts.map(post => (
                        <Col key={post._id} className='my-2'>
                            <SinglePost post={post}/>
                        </Col>
                    ))}
                </Row>
                {/*Open add post modal*/}
                <OverlayTrigger placement='left' overlay={<Tooltip>Add a new thing to learn</Tooltip>}>
                    <Button className="btn-floating" onClick={setShowAddPostModal.bind(this, true)}>
                        <img src={addIcon} alt="add-post" width='60' height='60'/>
                    </Button>
                </OverlayTrigger>
            </>
        )
    }
    return (
        <>
            {body}
            <AddPostModal/>
            {
                post !== null && <UpdatePostModal/>
            }
            {/*after post is added, show toast*/}
            <Toast show={show}
                   style={{position: 'fixed', top: '20%', right: '10px'}}
                   className={`bg-${type} text-white`}
                   onClose={setShowToast.bind(this, {show: false, message: '', type: null})}
                   delay={3000}
                   autohide
                   animation={false}
            >
                <Toast.Body>
                    <strong>{message}</strong>
                </Toast.Body>
            </Toast>
        </>
    )
}

export default Dashboard
