const TeamMember = ({ image, name, role, description, isLeader = false }) => {
    const memberClass = isLeader 
      ? "team-leader team-member" 
      : "team-member";
      
    return (
      <div className={memberClass}>
        <img 
          src={`${image}`} 
          alt={name} 
          className="team-member-img" 
        />
        <h3>{name}</h3>
        <p className="roles">{role}</p>
        <p>{description}</p>
      </div>
    );
  };
  
  export default TeamMember;