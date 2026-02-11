import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const AvatarParticipant = ({
  totalParticipant,
  participant,
}: {
  participant: { image: string }[];
  totalParticipant: string;
}) => {
  return (
    <div className="flex -space-x-3">
      {participant.map((user) => (
        <Avatar key={user.image}>
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
      <Button
        variant="secondary"
        className="relative size-10 border-2 border-background hover:z-10 rounded-full text-xs"
      >
        +{totalParticipant}
      </Button>
    </div>
  );
};

export default AvatarParticipant;
