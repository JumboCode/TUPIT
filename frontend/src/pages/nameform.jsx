import Router from 'next/router';

export default function NameForm({ leader }) {
  const submitFirst = async (event) => {
    event.preventDefault();

    console.log('Received: ' + event.target.name.value);

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
            first_name: event.target.first.value,
          },
        },
      }),
    });

    console.log(res);
    Router.push('');
  };

  const submitLast = async (event) => {
    event.preventDefault();

    console.log('Received: ' + event.target.name.value);

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
            last_name: event.target.last.value,
          },
        },
      }),
    });

    console.log(res);
    Router.push('');
  };

  return (
    <div>
      <form onSubmit={submitFirst}>
        <input
          id="first"
          type="text"
          placeholder={leader.attributes.first_name}
          defaultValue=""
          required
        />
      </form>
      <form onSubmit={submitLast}>
        <input
          id="last"
          type="text"
          placeholder={leader.attributes.last_name}
          defaultValue=""
          required
        />
      </form>
    </div>
  );
}
