import Router from 'next/router';

export default function NameForm({ leader }) {
  const submit = async (event) => {
    event.preventDefault();

    let first = event.target.first.value;
    if (first == '') first = leader.attributes.first_name;

    let last = event.target.last.value;
    if (last == '') last = leader.attributes.last_name;

    const res = await fetch('http://localhost:8000/api/team_leaders/' + leader.id + '/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'TeamLeader',
          id: leader.id,
          attributes: {
            first_name: first,
            last_name: last,
          },
        },
      }),
    });

    console.log(res);
    Router.push('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <input id="first" type="text" placeholder={leader.attributes.first_name} defaultValue="" />
        <input id="last" type="text" placeholder={leader.attributes.last_name} defaultValue="" />
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
}
