import { Link } from "react-router-dom"

export const Home = () => {


  return(
    <div>
      <h1 className=" text-lg font-bold text-center mt-6">Welcome to SM Entertainment </h1>
      <ul>
        <li><Link to="/streaming">스트리밍</Link></li>

      </ul>
    </div>
  )
}


