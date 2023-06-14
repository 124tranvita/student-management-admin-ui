import { FC } from "react";
import { Wrapper, Card, Typography } from "../../commons/components";

import mentor from "../../assets/dev/mentor";
import MentorList from "./mentor-list";
import mentors from "../../assets/dev/mentors";

const Mentor: FC = () => {
  /** Handle update mentor info */
  const handleUpdate = () => {
    console.log("Handle update");
  };

  /** Handle remove mentor */
  const handleRemove = () => {
    console.log("Handle delete");
  };
  return (
    <Wrapper>
      <div>
        <Card cover={mentor.avatar}>
          <Typography text={mentor.name} type="title" size="large" />
          <Typography text={mentor.email} type="description" />
          <Typography text={mentor.roles} type="muted" />
        </Card>
      </div>
      <div className="w-3/4 p-4">
        <MentorList
          mentors={mentors}
          handleUpdate={handleUpdate}
          handleRemove={handleRemove}
        />
      </div>
    </Wrapper>
  );
};

export default Mentor;
