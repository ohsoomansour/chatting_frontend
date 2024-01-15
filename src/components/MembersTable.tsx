interface Imember {
  userId:string;
  name:string;
  address:string;
  lastActivityAt:string;
  isDormant:boolean | null;
  memberRole:string;
}
//로직: props로 members는 전체 회원, searchedMember

const MemberTable = ({members}:{members:Imember[]}) => {
  console.log('MemberTable')
  console.log(members);
  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-semibold mb-4">Member List</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">UserId</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">lastActivityAt</th>
            <th className="py-2 px-4 border-b">isDormant</th>
            <th className="py-2 px-4 border-b">memberRole</th>
          </tr>
        </thead>
        <tbody>
          {members && members.map((member, index) => (
            <tr key={index} className="text-center">
              <td className="text-center py-2 px-4 border-b">{member.userId}</td>
              <td className="text-center py-2 px-4 border-b">{member.name}</td>
              <td className="text-center py-2 px-4 border-b">{member.address}</td>
              <td className="text-center py-2 px-4 border-b">{member.lastActivityAt}</td>
              <td className="text-center py-2 px-4 border-b">{member.isDormant ? 'true' : (member.isDormant === false ? 'false' : '')}</td>
              <td className="text-center py-2 px-4 border-b">{member.memberRole}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
