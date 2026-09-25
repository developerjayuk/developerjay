import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import Moment from "react-moment";

class ProfileItem extends Component {
  render() {
    const { profile } = this.props;

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-2">
            <img
              src={profile.user.avatar}
              alt={profile.user.name}
              className="rounded-circle"
            />
          </div>
          <div className="col-lg-6 col-md-4 col-8">
            <h3>{profile.user.name}</h3>
            <p>
              {profile.status}{" "}
              {isEmpty(profile.company) ? null : (
                <span>at {profile.company}</span>
              )}
              {isEmpty(profile.location) ? null : (
                <span>
                  <br />
                  {profile.location}
                </span>
              )}
            </p>
            <p>
              {profile.education.length} Education Entries <br />
              {profile.experience.length} Experience Entries <br />
            </p>
            <p>
              Last updated <Moment fromNow>{profile.date}</Moment>
            </p>
            <Link to={`/profile/${profile.handle}`} className="btn btn-info">
              View this profile
            </Link>
          </div>
          <div className="col-md-4 d-none d-md-block">
            <h4>Skills</h4>
            <ul className="list-group">
              {profile.skills.slice(0, 4).map((skill, index) => (
                <li key={index} className="list-group-item">
                  <i className="fa fa-check pr-1" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
