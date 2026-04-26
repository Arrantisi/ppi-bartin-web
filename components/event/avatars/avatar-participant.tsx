import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

const AvatarParticipant = ({
  participant = [],
}: {
  participant: { image: string }[];
}) => {
  const showParticipant = 2;
  const filteredParticipant = participant.slice(0, showParticipant);

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-3">
        {filteredParticipant.map((user, idx) => (
          <Avatar key={idx + user.image}>
            <AvatarImage
              src={user.image}
              alt="@reui"
              className="border border-accent hover:z-10"
            />
            <AvatarFallback className="border-2 border-background hover:z-10 text-foreground">
              CN
            </AvatarFallback>
          </Avatar>
        ))}
        {participant.length > showParticipant && (
          <Avatar>
            <AvatarFallback className="border-2 border-background hover:z-10 text-foreground">
              + {participant.length - showParticipant}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default AvatarParticipant;
