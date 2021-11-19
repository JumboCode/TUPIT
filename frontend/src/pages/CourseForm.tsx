import React, { memo, useEffect, useState } from 'react';
import Router from 'next/router';

interface Course {
  course_title: string;
  course_number_tufts: string;
  course_number_bhcc: string;
  credits_tufts: number;
  credits_bhcc: number;
  department: string;
  instructors: string[];
  prereqs: [];
}

export const CourseForm = memo(function CourseFormFn() {
  const [departments, setDepartments] = useState<Map<string, string> | undefined>(new Map());
  const [courses, setCourses] = useState();

  useEffect(() => {
    console.log('hello');
    fetch('http://localhost:8000/api/course/', {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const departments = new Map<string, string>(
          res.data.actions.POST.department.choices.map((x) => [x.display_name, x.value])
        );
        console.log(departments.keys());
        setDepartments(departments);
      });

    fetch('http://localhost:8000/api/course/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        // setDepartments(res.data.actions.POST.department.choices);
      });
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    console.log('Hello');
    console.log('This is the course title', event.target.course_title.value);

    let newCourse: Course = {} as Course;

    newCourse.course_title = event.target.course_title.value;
    newCourse.course_number_tufts = event.target.course_number_tufts.value;
    newCourse.course_number_bhcc = event.target.course_number_bhcc.value;
    newCourse.credits_tufts = event.target.credits_tufts.value;
    newCourse.credits_bhcc = event.target.credits_bhcc.value;
    newCourse.department = departments.get(event.target.department.value);
    console.log('this is the department', newCourse.department, event.target.department.value);
    // newCourse.instructors = event.target.instructor.value;

    // const relationships = {
    //   prereqs: {
    //     data: newCourse.prereqs.map((course) => {
    //       return {
    //         type: 'Course',
    //         id: 1,
    //       };
    //     }),
    //   },
    // };
    const res = await fetch('http://localhost:8000/api/course/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'Course',
          attributes: {
            course_title: newCourse.course_title,
            course_number_tufts: newCourse.course_number_tufts,
            course_number_bhcc: newCourse.course_number_bhcc,
            credits_tufts: newCourse.credits_tufts,
            credits_bhcc: newCourse.credits_bhcc,
            department: newCourse.department,
            instructors: [],
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
        <div>
          Course Title:
          <input type="text" id="course_title" />
        </div>
        <div>
          Tufts Course Number:
          <input type="text" id="course_number_tufts" />
        </div>
        <div>
          BHCC Course Number:
          <input id="course_number_bhcc" type="text" />
        </div>
        <div>
          Tufts Credits :
          <input id="credits_tufts" type="text" />
        </div>
        <div>
          BHCC Credits :
          <input id="credits_bhcc" type="text" />
        </div>
        <div>
          Department :
          <select name="department" id="department" size="1">
            {Array.from(departments.keys()).map((key) => (
              <option> {key} </option>
            ))}
          </select>
        </div>

        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
});
