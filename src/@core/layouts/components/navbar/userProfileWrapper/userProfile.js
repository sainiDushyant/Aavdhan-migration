import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Col,
  Input,
  Form,
  Button,
  Label,
  CustomInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap'
import { User, Mail, Smartphone, Lock } from 'react-feather'
import jwt_decode from 'jwt-decode'

const UserProfile = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>User Details</CardTitle>
      </CardHeader>
      <CardBody>
        <Form>
          <FormGroup row>
            <Label sm='3' for='nameIcons'>
              User Name
            </Label>
            <Col sm='9'>
              <InputGroup className='input-group-merge'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <User size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type='text'
                  name='name'
                  id='nameIcons'
                  placeholder='User Name'
                  disabled
                  value={jwt_decode(localStorage.getItem('accessToken')).userData.name}
                />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm='3' for='EmailIcons'>
              Email
            </Label>
            <Col sm='9'>
              <InputGroup className='input-group-merge'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <Mail size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type='email'
                  name='Email'
                  id='EmailIcons'
                  placeholder='Email'
                  disabled
                  value={jwt_decode(localStorage.getItem('accessToken')).userData.email}
                />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm='3' for='mobileIcons'>
              Mobile
            </Label>
            <Col sm='9'>
              <InputGroup className='input-group-merge'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <Smartphone size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type='text'
                  name='phone_number'
                  id='mobileIcons'
                  placeholder='Mobile'
                  disabled
                  value={jwt_decode(localStorage.getItem('accessToken')).userData.phone_number}
                />
              </InputGroup>
            </Col>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  )
}
export default UserProfile
