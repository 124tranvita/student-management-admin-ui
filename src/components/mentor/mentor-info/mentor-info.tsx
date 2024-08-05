import { FC, useEffect, useMemo, useRef } from "react";
import * as _ from "lodash";
import { useSelectId } from "../../../hooks/useSelectId";
import { Mentor, mentorInitial } from "../../../commons/model";
import { Card, HashDiv, Typography } from "../../../commons/components";
import { capitalize, getEduction } from "../../../commons/utils";
import * as Constants from "../../../commons/constants";
import { DetailInfoLoader } from "../../../commons/components/skeletons";
import ClassroomManagementPanel from "../classroom-management/assignment-panel";

type MentorInfoProps = {
  mentors: Mentor[];
};

const MentorInfo: FC<MentorInfoProps> = ({ mentors }) => {
  const prevSelectedItem = useRef<Mentor>(mentorInitial);
  const foundFlag = useRef<boolean>(false);

  /** Custom hooks */
  const { selectedId, setSelectedId } = useSelectId();

  /** Get mentor */
  const mentor = useMemo(() => {
    const found = mentors.find((item: Mentor) => item._id === selectedId);

    if (found) {
      prevSelectedItem.current = found;
      foundFlag.current = true;
      return found;
    } else {
      foundFlag.current = false;
      if (!_.isEqual(prevSelectedItem.current, mentorInitial)) {
        return prevSelectedItem.current;
      }
    }
  }, [mentors, selectedId]);

  /** Run on `mentors` array changed
   * 1. When array have more than 1 item, if `selectedId` or `foundFlag` is false, set the `selectedId` as first array item.
   * 2. When array is empty, clear the `selectedId`
   */
  useEffect(() => {
    if (mentors[0]) {
      if (!selectedId || !foundFlag.current) {
        setSelectedId(mentors[0]._id);
      }
    } else {
      setSelectedId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentors]);

  if (!mentor) {
    return <DetailInfoLoader />;
  }

  return (
    <Card avatar={mentor.avatar}>
      <div className="mb-6">
        <Typography text={mentor.name} type="title" size="large" />
        <Typography text={mentor.email} type="description" />
        <Typography text={capitalize(mentor.roles)} type="muted" />
        <Typography
          text={`${getEduction(mentor.education)} ${mentor.specialized}`}
          type="muted"
        />
      </div>
      {mentor.roles === Constants.Role.Mentor && (
        <div className="mb-6">
          <Typography
            text={`Assigned classrooms: ${mentor.assignedClassroom}/6`}
            type="muted"
          />
          <Typography
            text={`Assigned students: ${mentor.assignedStudent}/25`}
            type="muted"
          />
        </div>
      )}
      {mentor.languages[0] &&
        mentor.languages.map((item: string, index: number) => (
          <HashDiv key={index} value={item} />
        ))}
      <ClassroomManagementPanel id={mentor._id} />
    </Card>
  );
};

export default MentorInfo;
