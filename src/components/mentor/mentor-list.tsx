import { FC } from "react";
import { Mentor } from "../../commons/model";
import {
  Typography,
  ListItemAvatar,
  ListItemWrapper,
} from "../../commons/components";
import { ListItemControl } from "../../commons/components/list-item";
import { isBefore } from "../../commons/date-func";
import { capitalize, getStatus } from "../../commons/utils";
import UpdateContainer from "./update";

type Props = {
  mentors: Mentor[];
  limit: number;
  setMentors: React.Dispatch<React.SetStateAction<Mentor[]>>;
  setEventId: (value: string) => void;
};
const MentorList: FC<Props> = ({ mentors, limit, setMentors, setEventId }) => {
  return (
    <>
      {mentors &&
        mentors.length > 0 &&
        mentors
          .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1))
          .slice(0, limit)
          .map((item) => (
            <ListItemWrapper key={item._id} id={item._id}>
              <ListItemAvatar img={item.avatar}>
                <div className="w-64">
                  <Typography text={item.name} type="name" size="normal" />
                  <Typography
                    text={`${item.email} - ${getStatus(item.status)}`}
                    type="muted"
                    size="small"
                  />
                </div>
              </ListItemAvatar>
              <div className="w-16">
                <Typography text="Role" type="name" size="small" />
                <Typography
                  text={capitalize(item.roles)}
                  type="muted"
                  size="small"
                />
              </div>

              <ListItemControl
                editNode={
                  <UpdateContainer
                    mentor={item}
                    setMentors={setMentors}
                    setEventId={setEventId}
                  />
                }
                deleteNode={<></>}
              />
            </ListItemWrapper>
          ))}
    </>
  );
};

export default MentorList;
