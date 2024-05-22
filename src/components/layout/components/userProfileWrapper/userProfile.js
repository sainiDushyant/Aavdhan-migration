import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Col,
  Input,
  Form,
  Label,
  InputGroup,
  InputGroupText,
} from 'reactstrap';
import { User, Mail, Smartphone } from 'react-feather';
import { jwtDecode } from 'jwt-decode';

const UserProfile = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">User Details</CardTitle>
      </CardHeader>
      <CardBody>
        <Form>
          <FormGroup row>
            <Label sm="3" for="nameIcons">
              User Name
            </Label>
            <Col sm="9">
              <InputGroup className="input-group-merge">
                <InputGroupText>
                  <User size={15} />
                </InputGroupText>
                <Input
                  type="text"
                  name="name"
                  id="nameIcons"
                  placeholder="User Name"
                  disabled
                  value={jwtDecode(localStorage.getItem('token')).userData.name}
                />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm="3" for="EmailIcons">
              Email
            </Label>
            <Col sm="9">
              <InputGroup className="input-group-merge">
                <InputGroupText>
                  <Mail size={15} />
                </InputGroupText>
                <Input
                  type="email"
                  name="Email"
                  id="EmailIcons"
                  placeholder="Email"
                  disabled
                  value={
                    jwtDecode(localStorage.getItem('token')).userData.email
                  }
                />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm="3" for="mobileIcons">
              Mobile
            </Label>
            <Col sm="9">
              <InputGroup className="input-group-merge">
                <InputGroupText>
                  <Smartphone size={15} />
                </InputGroupText>
                <Input
                  type="text"
                  name="phone_number"
                  id="mobileIcons"
                  placeholder="Mobile"
                  disabled
                  value={
                    jwtDecode(localStorage.getItem('token')).userData
                      .phone_number
                  }
                />
              </InputGroup>
            </Col>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};
export default UserProfile;
