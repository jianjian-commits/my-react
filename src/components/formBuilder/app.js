// import React from "react";
// import { connect } from "react-redux";
// import {
//   BrowserRouter as Router,
//   Route,
//   Switch,
//   Redirect
// } from "react-router-dom";
// import ErrorPage from "./component/ErrrorBoundaries/errorPage";
// import ReactFormBuilder from "./component/formBuilder/formBuilder";
// import Home from "./component/homePage/home";
// import FormSubmitData from "./component/formData/formSubmitData";
// import Submission from "./component/submission/submission";
// import Header from "./component/header/header";
// import FormLayout from "./component/layout/layout";
// import mobileAdoptor from "./utils/mobileAdoptor";

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       hasErr: false,
//       error: null
//     };
//   }
//   componentDidCatch(error, info) {
//     this.setState({
//       hasErr: true,
//       error
//     });
//   }

//   render() {
//     const { hasErr, error } = this.state;
//     return (
//       <>
//         <Header />
//         {hasErr ? (
//           <ErrorPage error={error} />
//         ) : (
//             <Router>
//               <Switch>
//                 <Route exact path="/" component={Home} />
//                 <Route path="/formbuild" component={ReactFormBuilder} />
//                 <Route path="/layout" component={FormLayout} />
//                 <Route
//                   path="/submission"
//                   component={mobileAdoptor.submission(Submission)}
//                 />
//                 <Route
//                   path="/submitdata"
//                   component={mobileAdoptor.data(FormSubmitData)}
//                 />
//                 <Redirect from="/*" to="/" />
//               </Switch>
//             </Router>
//           )}
//       </>
//     );
//   }
// }

// export default connect(store => ({}), {
//   // mockLoginAndSetData
// })(App);
