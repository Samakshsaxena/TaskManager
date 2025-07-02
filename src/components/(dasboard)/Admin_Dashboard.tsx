
import AllTasks from "../(dasboard_component)/AllTasks";
import Header from "../(dasboard_component)/Header";
import TaskForm from "../(dasboard_component)/TaskForm";

function Admin_Dashboard() {
    return (
        <div className='w-full'>   

            <Header />   
            <TaskForm />
            <AllTasks />
        </div>
        
    );
}
export default Admin_Dashboard;






