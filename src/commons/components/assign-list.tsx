import { FC, ReactNode } from "react";
import { Form } from "formik";
import { EventId } from "../constants";
import { isBefore } from "../date-func";
import {
  AssignClassroomMentor,
  AssignStudentMentor,
  Classroom,
  Student,
} from "../model";
import { capitalize, getGender, getStatus } from "../utils";
import Typography from "./typography";
import { AssignFormModal, UnassignFormModal } from "./modal";
import { ListItemAvatar, FormikCheckbox } from ".";

type Props = {
  children: ReactNode;
};

export const AssignListWrapper: FC<Props> = ({ children }) => {
  return (
    <>
      <li className="flex justify-between items-center p-2 mb-2 rounded-md border border-slate-100 hover:shadow-sm hover:bg-slate-100 duration-300 hover:cursor-pointer">
        {children}
      </li>
    </>
  );
};

type UnAssignListItemControlProps = {
  handleUnAssign: () => void;
  setEventId: (value: EventId) => void;
  name: string;
};

export const UnAssignListItemControl: FC<UnAssignListItemControlProps> = ({
  handleUnAssign,
  setEventId,
  name,
}) => {
  return (
    <div className="flex justify-start items-center ">
      <div>
        <UnassignFormModal
          title="Confirm"
          handleSubmit={handleUnAssign}
          setEventId={setEventId}
        >
          <Typography
            text={`Unassign student "${name}"?`}
            type="name"
            size="normal"
          />
        </UnassignFormModal>
      </div>
    </div>
  );
};

type AssignListItemControlProps = {
  handleAssign: () => void;
  setEventId: (value: EventId) => void;
  name: string;
};

export const AssignListItemControl: FC<AssignListItemControlProps> = ({
  handleAssign,
  setEventId,
  name,
}) => {
  return (
    <div className="flex justify-start items-center ">
      <div>
        <AssignFormModal
          title="Confirm"
          handleSubmit={handleAssign}
          setEventId={setEventId}
        >
          <Typography text={`Assign "${name}"?`} type="name" size="normal" />
        </AssignFormModal>
      </div>
    </div>
  );
};

type NoDataPlaceHolderProps = {
  eventId: EventId;
  queryString: string;
  prefix: string;
};

export const NoDataPlaceHolder: React.FC<NoDataPlaceHolderProps> = ({
  eventId,
  queryString,
  prefix,
}) => {
  return (
    <div className="flex justify-center items-center place-items-center relative p-4">
      {eventId === EventId.Search || queryString ? (
        <div>No result was found.</div>
      ) : (
        <div>{`Not have any ${prefix} assinged yet.`}</div>
      )}
    </div>
  );
};

type AssignStudentListProps = {
  records: AssignStudentMentor[];
  handleUnAssign: (value: string) => void;
  setEventId: React.Dispatch<React.SetStateAction<EventId>>;
  eventId: EventId;
  queryString: string;
  prefix: string;
};

export const AssignStudentList: React.FC<AssignStudentListProps> = ({
  records,
  handleUnAssign,
  setEventId,
  eventId,
  queryString,
  prefix,
}) => {
  return (
    <>
      {records && records.length > 0 ? (
        records
          .sort((a, b) => (isBefore(a.assignedAt, b.assignedAt) ? 1 : -1))
          .map((item, index) => (
            <AssignListWrapper key={index}>
              <ListItemAvatar img={item.studentAvatar}>
                <div>
                  <Typography
                    text={item.studentName}
                    type="name"
                    size="normal"
                  />
                  <Typography
                    text={`${item.studentId} - ${getStatus(
                      item.studentStatus
                    )}`}
                    type="muted"
                    size="small"
                  />
                </div>
              </ListItemAvatar>
              <div className="w-16">
                <Typography text="Mentor" type="name" size="small" />
                <Typography text={item.mentorName} type="muted" size="small" />
              </div>
              <Form>
                <FormikCheckbox name="checked" value={item._id}>
                  {""}
                </FormikCheckbox>
              </Form>
              <UnAssignListItemControl
                handleUnAssign={() => handleUnAssign(item._id)}
                setEventId={setEventId}
                name={item.studentName}
              />
            </AssignListWrapper>
          ))
      ) : (
        <NoDataPlaceHolder
          eventId={eventId}
          queryString={queryString}
          prefix={prefix}
        />
      )}
    </>
  );
};

type UnassignStudentListProps = {
  records: Student[];
  handleAssign: (value: string) => void;
  setEventId: React.Dispatch<React.SetStateAction<EventId>>;
  eventId: EventId;
  queryString: string;
  prefix: string;
};

export const UnassignStudentList: React.FC<UnassignStudentListProps> = ({
  records,
  handleAssign,
  setEventId,
  eventId,
  queryString,
  prefix,
}) => {
  return (
    <>
      {records && records.length > 0 ? (
        records
          .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1))
          .map((item, index) => (
            <AssignListWrapper key={index}>
              <ListItemAvatar img={item.avatar}>
                <div>
                  <Typography text={item.name} type="name" size="normal" />
                  <Typography
                    text={`${item.studentId} - ${getStatus(item.status)}`}
                    type="muted"
                    size="small"
                  />
                </div>
              </ListItemAvatar>
              <div className="w-16">
                <Typography text="Gender" type="name" size="small" />
                <Typography
                  text={getGender(item.gender)}
                  type="muted"
                  size="small"
                />
              </div>
              <Form>
                <FormikCheckbox name="checked" value={item._id}>
                  {""}
                </FormikCheckbox>
              </Form>
              <AssignListItemControl
                handleAssign={() => handleAssign(item._id)}
                setEventId={setEventId}
                name={item.name}
              />
            </AssignListWrapper>
          ))
      ) : (
        <NoDataPlaceHolder
          eventId={eventId}
          queryString={queryString}
          prefix={prefix}
        />
      )}
    </>
  );
};

type AssignClassroomListProps = {
  records: AssignClassroomMentor[];
  handleUnAssign: (value: string) => void;
  setEventId: React.Dispatch<React.SetStateAction<EventId>>;
  eventId: EventId;
  queryString: string;
  prefix: string;
};

export const AssignClassroomList: React.FC<AssignClassroomListProps> = ({
  records,
  handleUnAssign,
  setEventId,
  eventId,
  queryString,
  prefix,
}) => {
  return (
    <>
      {records && records.length > 0 ? (
        records
          .sort((a, b) => (isBefore(a.assignedAt, b.assignedAt) ? 1 : -1))
          .map((item, index) => (
            <AssignListWrapper key={index}>
              <div className="w-full flex justify-between">
                <div style={{ flex: "3" }}>
                  <ListItemAvatar img={item.cover}>
                    <Typography text={item.name} type="name" size="normal" />
                    <Typography
                      text={capitalize(item.description || "")}
                      type="muted"
                      size="small"
                    />
                  </ListItemAvatar>
                </div>
                <div style={{ flex: "2" }}>
                  <Typography text="Languages" type="name" size="small" />
                  <div className="flex">
                    {item.languages[0] &&
                      item.languages.map((item: string, index: number) => (
                        <span className="mr-1" key={index}>
                          <Typography
                            text={`${item}`}
                            type="muted"
                            size="small"
                          />
                        </span>
                      ))}
                  </div>
                </div>
                <div style={{ flex: "1" }}>
                  <Form>
                    <FormikCheckbox name="checked" value={item._id}>
                      {""}
                    </FormikCheckbox>
                  </Form>
                </div>
                <UnAssignListItemControl
                  handleUnAssign={() => handleUnAssign(item._id)}
                  setEventId={setEventId}
                  name={item.name}
                />
              </div>
            </AssignListWrapper>
          ))
      ) : (
        <NoDataPlaceHolder
          eventId={eventId}
          queryString={queryString}
          prefix={prefix}
        />
      )}
    </>
  );
};

type UnassignClassroomListProps = {
  records: Classroom[];
  handleAssign: (value: string) => void;
  setEventId: React.Dispatch<React.SetStateAction<EventId>>;
  eventId: EventId;
  queryString: string;
  prefix: string;
};

export const UnassignClassroomList: React.FC<UnassignClassroomListProps> = ({
  records,
  handleAssign,
  setEventId,
  eventId,
  queryString,
  prefix,
}) => {
  return (
    <>
      {records && records.length > 0 ? (
        records
          .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1))
          .map((item, index) => (
            <AssignListWrapper key={index}>
              <div className="w-full flex justify-between">
                <div style={{ flex: "3" }}>
                  <ListItemAvatar img={item.cover}>
                    <Typography text={item.name} type="name" size="normal" />
                    <Typography
                      text={capitalize(item.description || "")}
                      type="muted"
                      size="small"
                    />
                  </ListItemAvatar>
                </div>
                <div style={{ flex: "2" }}>
                  <Typography text="Mentors" type="name" size="small" />
                  <Typography
                    text={`${item.assignedMentor}/25`}
                    type="muted"
                    size="small"
                  />
                </div>
                <div style={{ flex: "1" }}>
                  <Form>
                    <FormikCheckbox name="checked" value={item._id}>
                      {""}
                    </FormikCheckbox>
                  </Form>
                </div>
                <AssignListItemControl
                  handleAssign={() => handleAssign(item._id)}
                  setEventId={setEventId}
                  name={item.name}
                />
              </div>
            </AssignListWrapper>
          ))
      ) : (
        <NoDataPlaceHolder
          eventId={eventId}
          queryString={queryString}
          prefix={prefix}
        />
      )}
    </>
  );
};
