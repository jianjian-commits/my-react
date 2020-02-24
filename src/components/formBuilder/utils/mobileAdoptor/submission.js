import { compose, withProps, withHandlers } from "recompose";
import isMobile from "./helper";

const mobile = {
  is: isMobile(),
  className: "isMobile",
  style: {
    submission: {
      width: "100%",
      paddingTop: "3vh"
    },
    formLayout: {
      width: "92%",
      margin: "auto"
    },
    content: {
      width: "100%",
      marginTop: 0
    },
    title: {
      fontSize: "5vw",
      height: "auto",
      lineHeight: 2.2
    }
  }
};

export default function (component) {
  return compose(
    withProps(preProps => {
      return {
        mobile
      };
    }),
    withHandlers({
      mountClassNameOnRoot: () => className => {
        document.querySelector("body").classList.add(className);
      }
    })
  )(component);
}
