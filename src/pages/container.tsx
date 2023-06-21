import { FC } from "react";
import { Link } from "react-router-dom";

const Page: FC = () => {
  return (
    <>
      <ul>
        <Link to={"/mentor"}>
          <li>Mentors</li>
        </Link>
        <Link to={"/classroom"}>
          <li>Classroom</li>
        </Link>
        <Link to={"/student"}>
          <li>Students</li>
        </Link>
      </ul>
    </>
  );
};

export default Page;
