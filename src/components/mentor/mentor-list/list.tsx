import { FC } from "react";
import { Mentor } from "../../../commons/model";
import { isBefore } from "../../../commons/date-func";
import { NoItemContainer } from "../../../commons/components/ui";
import ListItem from "./item";

type Props = {
  mentors: Mentor[];
  limit: number;
  setMentors: React.Dispatch<React.SetStateAction<Mentor[]>>;
  setEventId: (value: string) => void;
};
const MentorList: FC<Props> = ({ mentors, limit, setMentors, setEventId }) => {
  return (
    <>
      {mentors && mentors.length > 0 ? (
        mentors
          .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1))
          .slice(0, limit)
          .map((item) => (
            <ListItem
              key={item._id}
              item={item}
              setMentors={setMentors}
              setEventId={setEventId}
            />
          ))
      ) : (
        <>
          <NoItemContainer />
        </>
      )}
    </>
  );
};

export default MentorList;
