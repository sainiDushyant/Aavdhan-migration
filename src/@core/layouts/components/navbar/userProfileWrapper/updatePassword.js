import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Col,
  Form,
  Button,
  Label,
  InputGroup
} from "reactstrap"
import jwt_decode from "jwt-decode"
import InputPasswordToggle from "@components/input-password-toggle"
import useJwt from "@src/auth/jwt/useJwt"
import authLogout from "../../../../../auth/jwt/logoutlogic"
import { toast } from "react-toastify"
import Toast from "@src/views/ui-elements/cards/actions/createToast"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"

const MySwal = withReactContent(Swal)

const UpdatePassword = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  //  password state
  const [formValues, setFormValues] = useState({
    old_pass: "",
    password: "",
    password2: ""
  })

  // Logout User
  const [logout, setLogout] = useState(false)
  useEffect(() => {
    if (logout) {
      authLogout(history, dispatch)
    }
  }, [logout])

  // Api to Post to update user password

  const fetchPostData = async (params) => {
    return await useJwt
      .postUpdatePassword(params)
      .then((res) => {
        const status = res.status
        return [status, res]
      })
      .catch((err) => {
        if (err.response) {
          const status = err.response.status
          return [status, err]
        } else {
          return [0, err]
        }
      })
  }

  const postUpdatePassword = async () => {
    const [status, response] = await fetchPostData({
      ...formValues,
      email: jwt_decode(localStorage.getItem("accessToken")).userData.email
    })

    if (status === 200 || status === 202) {
      MySwal.fire({
        icon: "success",
        title: "Please notice !",
        text: `${response?.data?.data?.result?.success}`,
        customClass: {
          confirmButton: "btn btn-success"
        }
      }).then((result) => {
        if (result.isConfirmed) {
          setFormValues(response)
          setLogout(true)
        }
      })
    } else if (status === 406) {
      const { error } = response?.response?.data?.data || {}

      if (status === 406) {
        const swalConfig = {
          icon: "error",
          title: "Failed!",
          customClass: {
            confirmButton: "btn btn-danger"
          }
        }

        if (error?.detail) {
          swalConfig.text = error.detail
        } else if (error?.message) {
          swalConfig.text = error.message
        } else if (error?.password) {
          swalConfig.html = error.password.map((msg) => `<p>${msg}</p>`).join("")
        }

        MySwal.fire(swalConfig)
      }
    } else if (status === 401 || status === 403) {
      toast.error(
        <Toast msg={`${response?.response?.data?.data?.error?.detail}`} type='danger' />,
        {
          hideProgressBar: true
        }
      )
      setLogout(true)
    } else {
      toast.error(<Toast msg={"Something went wrong."} type='danger' />, {
        hideProgressBar: true
      })
    }
  }

  //  to show sweet alert to confirm update password
  const handleConfirmText = () => {
    return MySwal.fire({
      text: `Are you sure want want to update it`,
      title: "Are you sure !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ml-1"
      },
      buttonsStyling: false
    }).then(function (result) {
      // console.log()
      if (result.value) {
        postUpdatePassword()
      }
    })
  }

  // on change function
  const onChangePassword = (event) => {
    const name = event.target.name
    const value = event.target.value
    setFormValues((values) => ({ ...values, [name]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>New Password</CardTitle>
      </CardHeader>
      <CardBody>
        <Form
          // on submit form
          onSubmit={(e) => {
            e.preventDefault()
            //  To validate password
            if (formValues.password === formValues.password2) {
              handleConfirmText()
            } else {
              toast.error(<Toast msg={" Re-check Password ."} type='danger' />, {
                hideProgressBar: true
              })
            }
          }}
        >
          <FormGroup row>
            <Label sm='4' for='old_pass'>
              Old Password
            </Label>
            <Col sm='8'>
              <InputGroup className='input-group-merge'>
                <InputPasswordToggle
                  id='old_pass'
                  name='old_pass'
                  className='input-group-merge'
                  value={formValues.old_pass}
                  onChange={onChangePassword}
                  required
                />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm='4' for='password'>
              New Password
            </Label>
            <Col sm='8'>
              <InputGroup className='input-group-merge'>
                <InputPasswordToggle
                  id='password'
                  name='password'
                  className='input-group-merge'
                  value={formValues.password}
                  onChange={onChangePassword}
                  required
                />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm='4' for='password2'>
              Confirm New Password
            </Label>
            <Col sm='8'>
              <InputGroup className='input-group-merge'>
                <InputPasswordToggle
                  id='password2'
                  name='password2'
                  className='input-group-merge'
                  value={formValues.password2}
                  onChange={onChangePassword}
                  required
                />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup className='mb-0' row>
            <Col className='d-flex' md={{ size: 9, offset: 3 }}>
              <Button.Ripple className='mr-1' color='primary' type='submit'>
                Submit
              </Button.Ripple>
              {/* On reset the form */}
              <Button.Ripple
                outline
                color='secondary'
                type='reset'
                onClick={(e) => {
                  setFormValues("")
                }}
              >
                Reset
              </Button.Ripple>
            </Col>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  )
}
export default UpdatePassword
