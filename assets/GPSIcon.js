import * as React from "react";
import Svg, { Path } from "react-native-svg";

const GPSicon = ({ size = 24, fill = "#EF5266" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M12.0609 16.5002C14.5462 16.5002 16.5609 14.4855 16.5609 12.0002C16.5609 9.51489 14.5462 7.50018 12.0609 7.50018C9.57566 7.50018 7.56094 9.51489 7.56094 12.0002C7.56094 14.4855 9.57566 16.5002 12.0609 16.5002Z"
      fill={fill}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.061 1.8335C12.4291 1.8335 12.7276 2.13197 12.7276 2.50016V4.36169C16.4312 4.68047 19.3828 7.63055 19.7039 11.3335H21.5608C21.929 11.3335 22.2275 11.632 22.2275 12.0002C22.2275 12.3684 21.929 12.6668 21.5608 12.6668H19.7048C19.388 16.3744 16.4345 19.3294 12.7276 19.6484V21.5002C12.7276 21.8684 12.4291 22.1668 12.061 22.1668C11.6928 22.1668 11.3943 21.8684 11.3943 21.5002V19.6484C7.68746 19.3293 4.73398 16.3743 4.41722 12.6668H2.56095C2.19276 12.6668 1.89429 12.3684 1.89429 12.0002C1.89429 11.632 2.19276 11.3335 2.56095 11.3335H4.41807C4.73918 7.63058 7.69072 4.68052 11.3943 4.3617V2.50016C11.3943 2.13197 11.6928 1.8335 12.061 1.8335ZM5.72278 12.074C5.72545 12.0498 5.72682 12.0251 5.72682 12.0002C5.72682 11.9755 5.72548 11.9512 5.72288 11.9272C5.76456 8.46239 8.58627 5.66646 12.061 5.66646C15.5351 5.66646 18.3564 8.46131 18.3991 11.9252C18.3964 11.9498 18.3949 11.9748 18.3949 12.0002C18.3949 12.0258 18.3964 12.0511 18.3992 12.076C18.3616 15.5086 15.5955 18.2863 12.1674 18.3428C12.1328 18.3372 12.0972 18.3343 12.061 18.3343C12.0247 18.3343 11.9892 18.3372 11.9545 18.3428C8.52583 18.2863 5.75937 15.5075 5.72278 12.074Z"
      fill={fill}
    />
  </Svg>
);

export default GPSicon;
