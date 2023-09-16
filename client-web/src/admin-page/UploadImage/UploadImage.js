import React ,{useState,useEffect} from 'react';
import { DeleteFilled, EditFilled, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Modal, Upload, Form, Input, Button,message, Popconfirm, Space, Table, Avatar, Image, Row, Col} from 'antd';
import {formatDateForClient,Config,isEmptyOrNull, isPermission} from '../../util/service'
import Container from '../container/Container'
import {request} from "../../util/api";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const App = () => {
  const [listCategory, setListCategory] = useState([]);
  const [loading,setLoading] = useState(false)
  const [visibleModal, setVisibleModal] = useState(false)
  const [items, setItems] = useState(null)

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [imgFile, setImgFile] = useState(null)

  const [form] = Form.useForm();
  const handleCancel = () => setPreviewOpen(false);

  useEffect(()=>{
    getlistCategory()
  },[])
  
  const getlistCategory = () =>{
    setLoading(true)
      request('get','category/getList',{}).then(res=>{
        setLoading(false)
       if(res.status === 200){
          var data = res.data
          setListCategory(data.list_category)
       }
      })
  }

  const handleChange = ({ fileList: newFileList }) =>{ 
    setFileList(newFileList)
  };

  const onClickDelete = (id) =>{
    setVisibleModal(false)
    setLoading(true)
    request('delete','category/remove/'+id,{}).then(res=>{
      setLoading(false)
      if(res.status === 200){
        message.success(res.data.message)
        getlistCategory()
      }
     })
  }

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setImgFile(URL.createObjectURL(file.target.files[0]))
  };

  const onClickBtnAddNew = () =>{
    setVisibleModal(true)
  }

  const  onClickEdit = (param)=>{
    setItems(param)
    setVisibleModal(true)
  }

  const onFinish = (item) => {
    setLoading(true)
    setVisibleModal(false)
    handleCloseModle()
    const formData = new FormData();
    formData.append('category_name', item.category_name);
    formData.append('category_desc', isEmptyOrNull(item.category_desc) ? 'NO Category Descrition' : item.category_desc);
    formData.append("create_by", 1)
    if (fileList.length > 0) {
      formData.append('category_img', fileList[0].originFileObj);
    }
    
    var method = "post"
    var url = "category/create"
    if (items != null) {
      method = 'put'
      url = 'category/update'
      formData.append("category_id", items.category_id)
    }
    request(method, url, formData).then(res => {
      setLoading(false)
      if (res.status === 200) {
        getlistCategory()
        setItems(null)
        message.success(res.data.message)
      }
    })
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  useEffect(()=>{
      if(items != null){
        form.setFieldsValue({
          category_name : items.category_name,
          category_desc : items.category_desc
        })
      }
  },[items]);

  const handleCloseModle = () =>{ 
    form.resetFields()
    setItems(null)
    setFileList([])
    setVisibleModal(false)
 }

  return (
    <>
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
      dataSource={listCategory}
      columns={[
        {
          title : "No",
          render : (item,items,index)=>index + 1,
          key: "No"
        },
        {
          title : "category_name",
          key: "category_name",
          dataIndex:"category_name"
        },
        {
          title : "category_desc",
          key: "category_desc",
          dataIndex:"category_desc"
        },
        {
          title : "create_by",
          key: "create_by",
          dataIndex:"create_by"
        },
        {
          title : "category_img",
          key: "category_img",
          dataIndex:"category_img",
          render: (item,items,index)=>{
            return (
              <div style={{textAlign:'center'}}>
                        {item != null ?
                            <Avatar size="large" src={Config.imagePath+item} /> 
                            :
                            <Avatar size="large" icon={<UserOutlined />} />
                        } 
                    </div>
            )
          }
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
                  onConfirm={()=>onClickDelete(items.category_id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button disabled={!isPermission("category.Delete")}  danger size="small"><DeleteFilled/></Button>
                </Popconfirm>
                  <Button size="small" onClick={()=>onClickEdit(items)}><EditFilled/></Button>
              </Space>
            )
          }
        },
      ]}
      />
    </Container>

{/* =============================================================== */}

    <Modal
        title={items !=null ? "Update Category":"New Admin-User"}
        open={visibleModal}
        onCancel={()=>{
          form.resetFields()
          handleCloseModle()
        }}
        onOk={()=>{
          form.resetFields()
          handleCloseModle()
        }}
        footer={null}
      >
        <Form 
          form={form} 
          onFinish={(item)=>{
            form.resetFields()
            onFinish(item)
          }} 
          layout="vertical"
        >

          <Form.Item label="Category Name" name="category_name" rules={[{ required: true, message: 'Please enter a category name.' }]}>
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item label="Category Description" name="category_desc">
            <Input.TextArea placeholder="Enter category description" />
          </Form.Item>

          <Form.Item label="Category Image">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Upload
                  action={null}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
              </Col>
              <Col span={12}>
                <div style={{ width: 100, height: 100}}>
                  {imgFile != null ? (
                    <div>
                      <Image
                        src={imgFile}
                        style={{ width: 100 }}
                        alt={imgFile}
                      />
                    </div>
                  )
                  :
                  (
                      <div className='animate__animated animate__fadeInRight'>
                        {items &&
                          <Image
                            src={Config.imagePath + items.category_img}
                            alt={items.category_img}
                            style={{ width: 100, height: 100,borderRadius:10,padding: 5, margin: 'auto',border: '1px solid red'}}
                          />
                        }
                      </div>
                  )
                  }
                </div>
              </Col>
            </Row>
            <Modal
              open={previewOpen}
              footer={null}
              onCancel={handleCancel}>
              <img
                alt="example"
                style={{
                  width: '100%',
                }}
                src={previewImage}
              />
            </Modal>
          </Form.Item>

          <Form.Item style={{ textAlign:'right' }}>
            <Space>
                <Button 
                    danger
                    onClick={()=>{
                      handleCloseModle()
                      form.resetFields()
                    }}
                >
                    Cancel
                </Button>
                <Button htmlType='submit'>{items !=null ? "Update" : "Save"}</Button>
            </Space>
          </Form.Item>

        </Form>
    </Modal>
   
    </>
  );
};
export default App;

//==================================================================
// import React from "react";
// import { Modal, Form, Input, Upload, Button, Space, Image } from "antd";

// const ModalForm = ({
//   items,
//   visibleModal,
//   handleCloseModle,
//   form,
//   onFinish,
//   fileList,
//   handlePreview,
//   handleChange,
//   uploadButton,
//   Config,
// }) => {
//   return (
//     <Modal
//       title={items != null ? "Update Category" : "New Admin-User"}
//       visible={visibleModal}
//       onCancel={handleCloseModle}
//       footer={null}
//     >
//       <Form form={form} onFinish={onFinish} layout="vertical">
//         <Form.Item
//           label="Category Name"
//           name="categoryName"
//           rules={[{ required: true, message: "Please enter a category name." }]}
//         >
//           <Input placeholder="Enter category name" />
//         </Form.Item>

//         <Form.Item
//           label="Category Description"
//           name="categoryDesc"
//           rules={[{ required: true, message: "Please enter a category description." }]}
//         >
//           <Input.TextArea placeholder="Enter category description" />
//         </Form.Item>

//         <Form.Item label="Category Image">
//           <Upload
//             listType="picture-circle"
//             fileList={fileList}
//             onPreview={handlePreview}
//             onChange={handleChange}
//           >
//             {fileList.length >= 8 ? null : uploadButton}
//           </Upload>
//           <div>
//             {handlePreview != null ? (
//               <Image src={handlePreview} style={{ width: 100 }} alt={handlePreview} />
//             ) : (
//               <div>
//                 {items && items.categoryImg && (
//                   <Image
//                     src={Config.imagePath + items.categoryImg}
//                     alt={items.categoryImg}
//                     style={{ width: 100 }}
//                   />
//                 )}
//               </div>
//             )}
//           </div>
//         </Form.Item>

//         <Form.Item style={{ textAlign: "right" }}>
//           <Space>
//             <Button
//               danger
//               onClick={() => {
//                 handleCloseModle();
//                 form.resetFields();
//               }}
//             >
//               Cancel
//             </Button>
//             <Button htmlType="submit">{items != null ? "Update" : "Save"}</Button>
//           </Space>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default ModalForm;

