import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const AvatarParticipant = ({
  totalParticipant,
  participant = [],
  maxCapacity,
}: {
  participant: { image: string }[];
  totalParticipant: number;
  maxCapacity: number;
}) => {
  const filteredParticipant = participant.slice(0, 3);

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-3">
        {filteredParticipant.map((user, idx) => (
          <Avatar key={idx + user.image}>
            <AvatarImage
              src={user.image}
              alt="@reui"
              className="border-2 border-background hover:z-10"
            />
            <AvatarFallback className="border-2 border-background hover:z-10">
              CN
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <p className="text-xs">
        {filteredParticipant.length > 0 && "+"} {totalParticipant} /{" "}
        {maxCapacity} Participants
      </p>
      {/* */}
    </div>
  );
};

export default AvatarParticipant;
