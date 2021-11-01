# Models

- Student

  - Name
    - `first_name:string`
    - `last_name:string`
  - `birthday:DateField`
  - `doc_num:string`
    - Validate format: "W123456..."
  - `tufts_num:string`
    - Validate format: "1234567"
  - `bhcc_num:string`
  - `parole_status:TextField`
  - `student_status:TextField`
  - `cohort:int`
  - `years_given:int`
  - `years_left:int`
  - `teams:string`
  - `course:ArrayField(CourseProgress)`
    - The student's course progress

- Course

  - `course_title:string`
  - Course Numbers
    - `course_number_tufts:string`
    - `course_number_bhcc:string`
    - Validate: one number can be null, but not both
  - Credits
    - `credits_tufts:int`
    - `credits_bhcc:int`
  - `department:string`
    - Field of choices
    - For now, list dummy departments
  - `prereqs:ManyToManyField(Course)`
  - `instructors:string[]`
    - Client refers to profs as instructors
  - `offered`
    - Records when course is offered
    - Spring, summer, fall

- CourseProgress

  - Represents a student's current or past progress in a course
  - `course:ForeignKey(Course)`
  - `grade:int`
  - `year_taken:double`
  - `in_progress:boolean`

- Degree
  - `degree_name:string`
  - Requirements
    - `reqs:ManyToManyField(Course)`
    - Degree should protect all its requirements from being deleted. I.e. when a course is deleted, ensure no degrees require it. Or suggest alternate behavior to the user (remove requirement, change to other course etc.)
  - `active:boolean`
    - All students are pursuing the same degree at a given time, this indicates whether everyone is pursuing this degree. Only one degree should have `active=True` at any given time
