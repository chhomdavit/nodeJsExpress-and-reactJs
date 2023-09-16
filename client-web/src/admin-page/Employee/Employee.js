import {useState,useEffect} from 'react';
import {request} from "../../util/api";
import{formatDateForClient,Config} from '../../util/service'
import Container from '../container/Container'

import {Avatar,Button,Popconfirm,Space,Table, message} from 'antd';
import {DeleteFilled, EditFilled, UserOutlined} from '@ant-design/icons';

const Employee = () => {
  const [list, setList] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false)
  const [loading,setLoading] = useState(false)

  const [imgObj, setImgObj] = useState(null)
  const [imgFile, setImgFile] = useState(null)
  const [items, setItems] = useState(null)

  useEffect(()=>{
    getlist()
  },[])
  
  const getlist = () =>{
    setLoading(true)
      request('get','employee/getAll',{}).then(res=>{
        setLoading(false)
       if(res.status === 200){
          var data = res.data
          setList(data.list)
       }
      })
  }

  const  onClickEdit = (param)=>{
    setItems(param)
    setVisibleModal(true)
  }

  const onFinish = (item) => {
    setLoading(true)
    setVisibleModal(false)
    setImgFile(null)
    setImgObj(null)
    var form = new FormData()
    form.append("category_name", item.category_name)
    form.append("category_desc", item.category_desc)
    form.append("create_by", 1)
    if (imgObj) {
      form.append("category_img", imgObj, imgObj.filename)
    }
    
    var method = "post"
    var url = "category/create"
    if (items != null) {
      method = 'put'
      url = 'category/update'
      form.append("category_id", items.category_id)
    }
    request(method, url, form).then(res => {
      setLoading(false)
      if (res.status === 200) {
        message.success(res.data.message)
        setItems(null)
        getlist()
      }
    })
  }

  const onClickDelete = (id) =>{
    setVisibleModal(false)
    setLoading(true)
    request('delete','category/remove/'+id,{}).then(res=>{
      setLoading(false)
      if(res.status === 200){
        message.success(res.data.message)
        getlist()
      }
     })
  }

  const onClickBtnAddNew = () =>{
    setVisibleModal(true)
  }
  const onCancelModalForm = () =>{
    setVisibleModal(false)
    setItems(null)
    setImgFile(null)
    setImgObj(null)
  }
  const onChangeImage = (event) =>{
    setImgObj(event.target.files[0])
    setImgFile(URL.createObjectURL(event.target.files[0]))
  }
  return (
    <Container
    loading={loading}
    pageTitle = "Category"
    btnRight = "New Category"
    onClickBtnAddNew={onClickBtnAddNew}
    search={{ 
      title:'Category Name',
      allowClear: true
     }}
    >
      <Table
      dataSource={list}
      columns={[
        {
          title : "No",
          render : (item,items,index)=>index + 1,
          key: "No"
        },
        {
          title : "FirstName",
          key: "FirstName",
          dataIndex:"FirstName"
        },
        {
          title : "LastName",
          key: "LastName",
          dataIndex:"LastName"
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
                  onConfirm={()=>onClickDelete(items.category_id)}
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
    </Container>
  )
}
export default Employee;
