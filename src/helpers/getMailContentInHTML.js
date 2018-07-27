const getMailContentInHTML = ({
  email,
  organisation,
  manager,
  token,
  URL,
}) => {
  console.log(organisation);
  return `
    <h2>Hey ${email} </h2>
    <br />
    You are invited to join ${organisation} as

    ${manager === 1 ? '<strong>a manager</strong>' : '<strong>an employee</strong>'};
    <br />
    Click <a href=${URL}/invite/register?token=${token}"</a>here</a> to register.
  `;
};

export default getMailContentInHTML;
