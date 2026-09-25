import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">&lt;Developer Jay /></h1>
                <p className="lead">Personal demo site for Jason James.</p>
                <p>This site was built using the latest technologies:</p>
                <p>
                  <i className="fab fa-node mr-2" />
                  Node <br />
                  <i className="fab fa-react mr-2" />
                  React <br />
                  <i className="fas fa-laptop-code mr-2" />
                  Express <br />
                  <i className="fas fa-database mr-2" />
                  MongoDB <br />
                  <i className="fas fa-cloud-upload-alt mr-2" />
                  Hosting by Heroku <br />
                </p>
                <hr />
                <Link to="/profiles" className="btn btn-lg btn-info mr-2">
                  View Profile
                </Link>
                <Link to="/login" className="btn btn-lg btn-light">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(Landing);
