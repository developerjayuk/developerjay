import React, { Component } from "react";
import Moment from "react-moment";
import isEmpty from "../../validation/is-empty";

class ProfileCreds extends Component {
  render() {
    const { experience, education } = this.props;

    const expList = experience.map(exp => (
      <li key={exp._id} className="list-group-item">
        <h4>{exp.company}</h4>
        <p>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment>&nbsp;-&nbsp;
          {exp.to === null ? (
            "Current"
          ) : (
            <Moment format="YYYY/MM/DD">{exp.to}</Moment>
          )}
        </p>
        <p>
          <strong>Position: </strong>
          {exp.title}
        </p>
        {isEmpty(exp.location) ? null : (
          <p>
            <strong>Location:</strong> {exp.location}
          </p>
        )}
        {isEmpty(exp.description) ? null : (
          <p>
            <strong>Description:</strong> {exp.description}
          </p>
        )}
      </li>
    ));

    const eduList = education.map(edu => (
      <li key={edu._id} className="list-group-item">
        <h4>{edu.school}</h4>
        <p>
          <Moment format="YYYY/MM/DD">{edu.from}</Moment>&nbsp;-&nbsp;
          {edu.to === null ? (
            "Current"
          ) : (
            <Moment format="YYYY/MM/DD">{edu.to}</Moment>
          )}
        </p>
        <p>
          <strong>Degree: </strong>
          {edu.degree}
        </p>
        <p>
          <strong>Field of Study: </strong>
          {edu.fieldofstudy}
        </p>
        {isEmpty(edu.description) ? null : (
          <p>
            <strong>Description:</strong> {edu.description}
          </p>
        )}
      </li>
    ));

    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">
            <i className="fas fa-briefcase mr-2" />
            Experience
          </h3>
          {expList.length > 0 ? (
            <ul className="list-group">{expList}</ul>
          ) : (
            <p className="text-center">No experience has been added</p>
          )}
        </div>
        <div className="col-md-6">
          <h3 className="text-center text-info">
            <i className="fas fa-graduation-cap mr-2" />
            Education
          </h3>
          {eduList.length > 0 ? (
            <ul className="list-group">{eduList}</ul>
          ) : (
            <p className="text-center">No education has been added</p>
          )}
        </div>
      </div>
    );
  }
}

export default ProfileCreds;
