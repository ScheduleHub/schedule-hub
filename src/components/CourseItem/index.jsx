import React from 'react';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class CourseItem extends React.Component {
  constructor(props) {
    super(props);
    const {
      courseCode, keepable, keep, onDropClick,
    } = props;
    this.courseCode = courseCode;
    this.keepable = keepable;
    this.keep = keep;
    this.onDropClick = onDropClick;
    this.state = {
      isHovered: false,
    };
  }

  onMouseEnter = () => {
    this.setState({
      isHovered: true,
    });
  }

  onMouseLeave = () => {
    this.setState({
      isHovered: false,
    });
  }

  onKeepChange = (checked) => {
    console.log(checked);
    this.setState({ keep: checked });
  }

  render() {
    const { isHovered } = this.state;
    const style = isHovered ? {} : { visibility: 'hidden' };
    return (
      <tr
        onClick={this.onClick}
        onMouseOver={this.onMouseEnter}
        onMouseOut={this.onMouseLeave}
      >
        <td style={{ verticalAlign: 'middle' }}>{this.courseCode}</td>
        {/* <td className="KeepColumn">
          <Form.Check
            custom
            type="checkbox"
            id={`checkbox-keep-${this.courseCode}`}
            label=""
            disabled={!this.keepable}
            style={{ verticalAlign: 'middle' }}
            onChange={(e) => this.onKeepChange(e.target.checked)}
          />
        </td> */}
        <td style={{ textAlign: 'right' }}>
          <Button size="sm" variant="outline-danger" style={style} className="DropButton" onClick={this.onDropClick}>✕</Button>
        </td>
      </tr>
    );
  }
}

export default CourseItem;
