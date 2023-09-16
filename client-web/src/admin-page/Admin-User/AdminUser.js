import {useEffect, useState} from 'react';
import {request} from "../../util/api";
import Container from '../container/Container'
import ModelForm from './ModelForm';
import dayjs from "dayjs"
import{formatDateForClient,Config} from '../../util/service'
import {UserOutlined,DeleteFilled,EditFilled} from '@ant-design/icons';
import {Avatar, Button, Popconfirm, Space, Table, message} from 'antd';


const AdminUser = () => {
    const [listAdminUser, setListAdminUser] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false)
    const [loading,setLoading] = useState(false);
    const [items, setItems] = useState(null)
    const [imgObj, setImgObj] = useState(null)
    const [imgFile, setImgFile] = useState(null)
    const [dob, setDob] = useState(dayjs());

    useEffect(()=>{
        getlistAdminUser()
      },[])

    const getlistAdminUser = () => {
        setLoading(true)
        request('get', 'adminUser/getList', {}).then(res => {
            setLoading(false)
            if (res.status === 200) {
                var data = res.data
                setListAdminUser(data.list_adminUser)
            }
        })
    }

    const onFinish = (item) =>{
        setLoading(true)
        setVisibleModal(false)
        setImgFile(null)
        setImgObj(null)
        setDob(dayjs())
        var form = new FormData()
        form.append("firstname",item.firstname)
        form.append("lastname",item.lastname)
        form.append("gender",item.gender)
        form.append("dob",dayjs(dob).format("YYYY-MM-DD"))
        form.append("user_email",item.user_email)
        form.append("telephone",item.telephone)
        form.append("password",item.password)
        form.append("is_active",item.is_active)
        if(imgObj){
          form.append("image_admin",imgObj,imgObj.filename)
        }
        var method = "post"
        var url = "adminUser/create"
        if(items !=null){
          method='put'
          url='adminUser/update'
          form.append("admin_user_id",items.admin_user_id)
        }
        request(method,url,form).then(res=>{
          setLoading(false)
          if(res.status === 200){
            message.success(res.data.message)
            setItems(null)
            getlistAdminUser()
          }
        })  
    }

    const onClickDelete = (id) =>{
      setVisibleModal(false)
      setLoading(true)
      request('delete','adminUser/remove/'+id,{}).then(res=>{
        setLoading(false)
        if(res.status === 200){
          message.success(res.data.message)
           getlistAdminUser()
        }
       })
    }

    const onClickBtnAddNew = () =>{
        setVisibleModal(true)
    }

    const  onClickEdit = (param)=>{
        setItems(param)
        setVisibleModal(true)
    }
    
    const onCancelModalForm = () =>{
        setImgFile(null)
        setImgObj(null)
        setVisibleModal(false)
        setItems(null)
        setDob(dayjs())
    }

    const onChangeImage = (event) =>{
        setImgObj(event.target.files[0])
        setImgFile(URL.createObjectURL(event.target.files[0]))
    }

    const onChangeDay = (date_js, dateString) =>{
      setDob(date_js)
    }

  return (
      <>
          <Container
              loading={loading}
              pageTitle="Admin User"
              btnRight="New Admin"
              onClickBtnAddNew={onClickBtnAddNew}
              search={{
                  title: 'Admin User Name',
                  allowClear: true
              }}
          >
              <Table
                  dataSource={listAdminUser}
                  columns={[
                      {
                          title: "No",
                          render: (item, items, index) => index + 1,
                          key: "No"
                      },
                      {
                          title: "Firstname",
                          key: "Firstname",
                          dataIndex: "firstname"
                      },
                      {
                          title: "lastname",
                          key: "lastname",
                          dataIndex: "lastname"
                      },
                      {
                        title : "gender",
                        key: "gender",
                        dataIndex:"gender",
                        render: (item,items,index)=>
                          item === 1 ? "Male" : "Female"
                      },
                      {
                        title : "dob",
                        key: "dob",
                        dataIndex:"dob",
                        render: (item,items,index)=>formatDateForClient(item)
                      },
                    //   {
                    //     title : "telephone",
                    //     key: "telephone",
                    //     dataIndex:"telephone"
                    //   },
                      {
                        title : "user_email",
                        key: "user_email",
                        dataIndex:"user_email"
                      },
                      {
                          title: "image_admin",
                          key: "image_admin",
                          dataIndex: "image_admin",
                          render: (item, items, index) => {
                              return (
                                  <div style={{ textAlign: 'center' }}>
                                      {item != null ?
                                          <Avatar size="large" src={Config.imagePath + item} />
                                          :
                                          <Avatar size="large" icon={<UserOutlined />} />
                                      }
                                  </div>
                              )
                          }
                      },
                      {
                        title : "is_active",
                        key: "is_active",
                        dataIndex:"is_active",
                        render: (item,items,index)=>
                          item === 0 ? 
                          <p style={{ color:"green" }}>Admin</p> 
                          : 
                          <p style={{ color:"red" }}>None_Admin</p>
                      },
                      {
                        title : "create_at",
                        key: "create_at",
                        dataIndex:"create_at",
                        render: (item,items,index)=>formatDateForClient(item)
                      },
                      {
                        title : "Action",
                        key: "Action",
                        render: (item,items,index)=>{
                          return(
                            <Space>
                              <Popconfirm
                                placement="topLeft"
                                title={"Delete"}
                                description={"Are sure to romove!"}
                                onConfirm={()=>onClickDelete(items.admin_user_id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button danger size="small"><DeleteFilled/></Button>
                              </Popconfirm>
                                <Button size="small" onClick={()=>onClickEdit(items)}><EditFilled/></Button>
                            </Space>
                          )
                        }
                      },
                  ]}
              />
              <ModelForm
                  items={items}
                  title={items != null ? "Update Admin-User" : "New Admin-User"}
                  open={visibleModal}
                  onCancel={onCancelModalForm}
                  onChangeImage={onChangeImage}
                  imgFile={imgFile}
                  onChangeDay={onChangeDay}
                  dob={dob}
                  onFinish={onFinish}
              />
          </Container>
      </>
  )
}

export default AdminUser
