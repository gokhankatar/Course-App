'use strict';

// Course Class
class Course {
    constructor(title, instructor, image) {
        this.courseId = Math.floor(Math.random() * 1000);
        this.title = title;
        this.instructor = instructor;
        this.image = image;
    }
};

// UI Class
class UI {

    // add course
    addCourseToList(course) {
        const list = document.getElementById('course-list');
        var html = `
        <tr>
        <td><img class="img-fluid" src="img/${course.image}" </td>
        <td class="text-white"> ${course.title} </td>
        <td class="text-white"> ${course.instructor} </td>
        <td> <a href="#" data-id="${course.courseId}" class="btn btn-danger btn-sm delete">Delete</a></td>
        </tr>
        `
        list.innerHTML += html;
    };

    // clear control
    clearControls() {
        document.getElementById('title').value = "";
        document.getElementById('image').value = "";
        document.getElementById('instructor').value = "";
    };

    //delete course
    deleteCourse(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
            return true;
        }
    };

    // show alert
    showAlert(message, className) {
        var alert = `
        <div class = "alert alert-${className}">
        ${message}
        </div>
        `;

        // alert location
        const row = document.querySelector('.row');
        row.insertAdjacentHTML('afterBegin', alert);

        // time-out
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2500)
    }
}

// Storage Class
class Storage {
    // get data from local
    static getCourses() {
        let courses;

        if (localStorage.getItem('courses') === null) {
            courses = [];
        } else {
            courses = JSON.parse(localStorage.getItem('courses'));
        }

        return courses;
    }

    // view on display
    static displayCourse(){
        const courses = Storage.getCourses();

        courses.forEach(course => {
            const ui = new UI();
            ui.addCourseToList(course);
        })
    };

    static addCourse(course){
        const courses = Storage.getCourses();
        courses.push(course);
        localStorage.setItem('courses', JSON.stringify(courses));
    };

    static deleteCourse(element) {
        if(element.classList.contains('delete')){
            const id = element.getAttribute('data-id');
            const courses = Storage.getCourses();

            courses.forEach((course,index) => {
                if(course.courseId == id) {
                    courses.splice(index,1);
                }
            });

            localStorage.setItem('courses', JSON.stringify(courses));
        }
    }
};

document.addEventListener('DOMContentLoaded', Storage.displayCourse);

document.getElementById('new-course').addEventListener('submit', function (e) {
    const title = document.getElementById('title').value;
    const instructor = document.getElementById('instructor').value;
    const image = document.getElementById('image').value;

    // create course object
    const course = new Course(title, instructor, image);

    // create UI
    const ui = new UI();

    if (title === "" || instructor === "" || image === "") {
        ui.showAlert('Please complete the form!', 'warning');
    } else {
        Storage.addCourse(course);
        ui.addCourseToList(course);
        ui.clearControls();
        ui.showAlert('The course has been added!', 'success');
    }
    e.preventDefault();
});

document.getElementById('course-list').addEventListener('click', function (e) {
    const ui = new UI();

    // delete course
    if (ui.deleteCourse(e.target) == true) {
        Storage.deleteCourse(e.target);
        ui.showAlert('The course has been deleted!', 'danger');
    }
});

