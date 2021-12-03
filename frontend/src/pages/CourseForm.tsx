import React, { memo, useEffect, useState } from 'react';
import Router from 'next/router';
import styles from './CourseForm.module.scss';
import { string } from 'prop-types';

interface Course {
  course_title: string;
  course_number_tufts: string;
  course_number_bhcc: string;
  credits_tufts: number;
  credits_bhcc: number;
  department: string;
  instructors: string[];
  prereqs: string[];
}

export const CourseForm = memo(function CourseFormFn() {
  // departments is a map from display name -> department abbreviation
  const [departments, setDepartments] = useState<Map<string, string> | undefined>(new Map());
  // courses is a map from name -> id
  const [courses, setCourses] = useState<Map<string, string> | undefined>(new Map());

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
        const courses = new Map<string, string>(
          res.data.map((x) => [x.attributes.course_title, x.id])
        );
        setCourses(courses);
      });
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    let options = event.target.prereqs.options;
    let result = [];
    for (var i = 0, iLen = options.length; i < iLen; i++) {
      let opt = options[i];
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }

    let newCourse: Course = {} as Course;

    newCourse.course_title = event.target.course_title.value;
    newCourse.course_number_tufts = event.target.course_number_tufts.value;
    newCourse.course_number_bhcc = event.target.course_number_bhcc.value;
    newCourse.credits_tufts = event.target.credits_tufts.value;
    newCourse.credits_bhcc = event.target.credits_bhcc.value;
    newCourse.department = departments.get(event.target.department.value);
    newCourse.prereqs = result;
    console.log('this is the department', newCourse.department, event.target.department.value);
    console.log('this is the newcourse', newCourse);
    newCourse.instructors = [event.target.instructors.value];

    const relationships = {
      prereqs: {
        data: newCourse.prereqs.map(
          (course) => 'http://localhost:8000/api/course/' + courses.get(course) + '/'
        ),
        meta: {
          count: newCourse.prereqs.length,
        },
      },
    };
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
            instructors: newCourse.instructors,
          },
          relationships: relationships,
        },
      }),
    });

    console.log(res);
    Router.push('');
  };

  return (
    <form onSubmit={submit} className={styles.formContainer}>
      <div>
        <span>Course Title:</span>
        <input type="text" id="course_title" />
      </div>
      <div>
        <span>Tufts Course Number:</span>
        <input type="text" id="course_number_tufts" />
      </div>
      <div>
        <span>BHCC Course Number: </span>
        <input id="course_number_bhcc" type="text" />
      </div>
      <div>
        <span>Tufts Credits :</span>
        <input id="credits_tufts" type="text" />
      </div>
      <div>
        <span>BHCC Credits :</span>
        <input id="credits_bhcc" type="text" />
      </div>
      <div>
        <span>Department : </span>
        <select name="department" id="department" size="1">
          {Array.from(departments.keys()).map((key) => (
            <option> {key} </option>
          ))}
        </select>
      </div>
      <div>
        <span>Prereqs : </span>
        <select name="prereqs" id="prereqs" size="1" multiple>
          {Array.from(courses.keys()).map((key) => (
            <option> {key} </option>
          ))}
        </select>
      </div>
      <div>
        <span>Instructors : </span>
        <input id="instructors" type="text" />
      </div>

      <button className={styles.submit} type="submit">
        SUBMIT
      </button>
    </form>
  );
});
