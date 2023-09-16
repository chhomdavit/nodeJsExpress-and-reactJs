import React ,{useState,useEffect} from 'react'
import Container from '../container/Container'
import {formatDateForClient,Config} from '../../util/service'
import {request} from "../../util/api";
import { Button, Col, ConfigProvider, DatePicker, Form, Image, Input, Modal, Popconfirm, Row, Select, Space, Table, Upload, message } from 'antd';
import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { AiFillFileImage } from "react-icons/ai";
import 'dayjs/locale/en'
import dayjs, { locale } from 'dayjs';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const MultipleImage = () => {
  const [list, setList] = useState([]);
  const [listImage, setListImage] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [loading,setLoading] = useState(false)
  const [visibleModal, setVisibleModal] = useState(false)
  const [items, setItems] = useState(null)
  const [dob, setDob] = useState(dayjs());

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();
  const handleCancel = () => setPreviewOpen(false);

  useEffect(()=>{
    getlist()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  const getlist = () =>{
      setLoading(true)
      request('get','multiImage/getList',{}).then(res=>{
      setLoading(false)
       if(res.status === 200){
          var data = res.data
          setList(data.list_images)
          getlistimage(data?.list_images[0]?.image_id)

          var arrTmp = []
          // eslint-disable-next-line array-callback-return
          data.list_category.map((item, index) => {
          arrTmp.push({
            label: item.category_name,
            value: item.category_id
          })
        })
        setListCategory(arrTmp)
       }
      })
  }

  const getlistimage = (id) =>{
    request('get','multiImage/getListImage/' + id,{}).then(res=>{
     if(res.status === 200){
        var data = res.data
        setListImage(data.data_Multi_Images)
     }
    })
  }

  const onChangeDay = (date_js) =>{
    setDob(date_js)
  }

  const handleChange = ({ fileList: newFileList }) =>{ 
    setFileList(newFileList)
  };

  const onFinish = (item) => {
    setLoading(true)
    setVisibleModal(false)
    handleCloseModle()
    const formData = new FormData();
    formData.append('image_name', item.image_name);
    formData.append('dob', dob.format('YYYY-MM-DD'));
    formData.append('category_id', item.category_id);
    fileList.forEach((item) => {
      formData.append("images", item.originFileObj);
    });
    
    var method = "post"
    var url = "multiImage/create"
    if (items != null) {
      method = 'put'
      url = 'multiImage/update'
      formData.append("image_id", items.image_id )
    }
    request(method, url, formData).then(res => {
      setLoading(false)
      if (res.status === 200) {
        getlist()
        setItems(null)
        message.success(res.data.message)
      }
    })
  };

  const  onClickEdit = async (param)=>{
    setItems(param)
    setVisibleModal(true)
  }

  const onClickDelete = (id) =>{
    request('delete','multiImage/remove/'+id,{}).then(res=>{
      if(res.status === 200){
        message.success(res.data.message)
        getlist()
      }
     })
  }

  const onClickBtnAddNew = () =>{
    setVisibleModal(true)
  }

  const handleCloseModle = () =>{ 
    form.resetFields()
    setItems(null)
    setFileList([])
    setVisibleModal(false)
    setDob(dayjs())
  }

  const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  setPreviewImage(file.url || file.preview);
  setPreviewOpen(true);
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

useEffect(() => {
  if (items != null) {
    form.setFieldsValue({
      image_name:  items.image_name,
      dob:         items.dob,
      images :     items.images,
      category_id: items.category_id,
    });
    setDob(dayjs(items.dob));
    setFileList([
      {
      uid: '-1',
      url: Config.imagePath + items.images,
      }
    ]); 
  }
},[form, items]);


// ផ្នែករូបភាព


const onClickDeleteImage = (id) =>{
  request('delete','multiImage/removeImage/'+id,{}).then(res=>{
    if(res.status === 200){
      message.success(res.data.message)
      getlist()
    }
   })
}

const onClickEditImage = (param) =>{
  setItems(param)
  setIsModalOpen(true);
}

const handleSaveImages = (item) => {
  handleOk()
  const formData = new FormData();
  fileList.forEach((item) => {
    formData.append("images", item.originFileObj);
  });
  var method = "post"
  var url = "multiImage/createImage"
  if (items != null) {
    method = 'put'
    url = 'multiImage/updateImage'
    formData.append("multi_image_id", items.multi_image_id )
  }
  request(method, url, formData).then(res => {
    setLoading(false)
    if (res.status === 200) {
      getlist()
      setItems(null)
      message.success(res.data.message)
    }
  })
};

const handleOk = () => {
  form.resetFields()
  setIsModalOpen(false);
  setItems(null)
  setFileList([])
};

  return (
    <>
    <Container
      pageTitle="MultipleImage"
      btnRight="New MultipleImage"
      onClickBtnAddNew={onClickBtnAddNew}
      search={{
        title: 'MultipleImage Name',
        allowClear: true
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={18}>
          <Table
            dataSource={list}
            onRow={(record, rowIndex) => {
              return {
                onClick: () => {
                  getlistimage(record.image_id)
                }
              };
            }}
            columns={[
              {
                title: "No",
                render: (item, items, index) => index + 1,
                key: "No"
              },
              {
                title: "Image Name",
                key: "image_name",
                dataIndex: "image_name"
              },
              {
                title: "ថ្ងៃ-ខែ-ឆ្នាំ-កំណើត",
                key: "dob",
                dataIndex: "dob",
                render: (item,items,index)=>formatDateForClient(item)
              },
              {
                title: "ប្រភេទ",
                width:'130px',
                dataIndex: "category_name",
                key: "category_name",
              },
              {
                title: "Main Images",
                key: "images",
                dataIndex: 'images',
                render: (item) => { 
                if (item == null) { 
                  return ( <div style={{ width: 80, height: 60, borderRadius: 10, padding: 5, margin: 'auto',textAlign:'center', border: '1px solid red' }}><AiFillFileImage style={{ fontSize: 40}} /></div> )} 
                else { 
                  return ( <Image 
                            width={80} 
                            height={60}
                            style={{ borderRadius: 10, padding: 5, margin: 'auto', border: '1px solid red' }} 
                            src={Config.imagePath + item} 
                            alt={item} /> )}}
              },
              {
                title: "create_at",
                key: "create_at",
                dataIndex: "create_at",
                render: (item, items, index) => formatDateForClient(item)
              },
              {
                title: "Action",
                key: "Action",
                render: (item, items, index) => {
                  return (
                    <Space>
                      <Popconfirm
                        placement="topLeft"
                        title={"Delete"}
                        description={"Are sure to romove!"}
                        onConfirm={() => onClickDelete(items.image_id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger size="small"><DeleteFilled /></Button>
                      </Popconfirm>
                      <Button size="small" onClick={() => onClickEdit(items)}><EditFilled /></Button>
                    </Space>
                  )
                }
              },
            ]}
          />
        </Col>
        
        <Col span={6}>
          <Table
            dataSource={listImage}
            columns={[
              {
                title: "No",
                render: (item, items, index) => index + 1,
                key: "No"
              },
              {
                title: "images",
                key: "images",
                dataIndex: "images",
                render: (item) => {
                  return (
                    <Image
                      width={80}
                      height={60}
                      style={{ borderRadius: 10, padding: 5, margin: 'auto', border: '1px solid red' }} 
                      src={Config.imagePath + item}
                      alt={item}
                    />
                  )
                }
              },
              {
                title: "Action",
                key: "Action",
                render: (item, items, index) => {
                  return (
                    <Space>
                      <Popconfirm
                        placement="topLeft"
                        title={"Delete"}
                        description={"Are sure to romove!"}
                        onConfirm={() => onClickDeleteImage(items.multi_image_id )}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger size="small"><DeleteFilled /></Button>
                      </Popconfirm>
                      <Button size="small" onClick={() => onClickEditImage(items)}><EditFilled /></Button>
                    </Space>
                  )
                }
              },
            ]}
          />
        </Col>
      </Row>
    </Container>
   
   {/* ===================================================== */}
  
      <Modal
        loading={loading}
        title={items != null ? "Update Data" : "New Date"}
        open={visibleModal}
        onCancel={() => {
          form.resetFields()
          handleCloseModle()
        }}
        onOk={() => {
          form.resetFields()
          handleCloseModle()
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={(item) => {
            form.resetFields()
            onFinish(item)
          }}
          layout="vertical"
        >

          <Form.Item label="image_name" name="image_name" rules={[{ required: true, message: 'Please enter a image_name.' }]}>
            <Input placeholder="Enter image_name" />
          </Form.Item>

          <Form.Item
            label="Category"
            name={'category_id'}
            rules={[{ required: true, message: 'Please fill in category_id' }]}
          >
            <Select
              placeholder='Please select a category'
              options={listCategory}
            >
            </Select>
          </Form.Item>

          <Form.Item label='ថ្ងៃ-ខែ-ឆ្នាំ-កំណើត' name={dob}>
            <ConfigProvider locale={locale}>
              <DatePicker
                style={{ width: '100%' }}
                placement='BottomLeft'
                placeholder='ថ្ងៃ-ខែ-ឆ្នាំ-កំណើត'
                format={'DD-MM-YYYY'}
                value={dob != null ? dayjs(dob, "DD-MM-YYYY") : dayjs(items.dob, "DD-MM-YYYY")}
                onChange={onChangeDay}
              />
            </ConfigProvider>
          </Form.Item>

          <Form.Item label="Image">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Upload
                  action={null}
                  multiple={true}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
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

          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button
                danger
                onClick={() => {
                  handleCloseModle()
                  form.resetFields()
                }}
              >
                Cancel
              </Button>
              <Button htmlType='submit'>{items != null ? "Update" : "Save"}</Button>
            </Space>
          </Form.Item>

        </Form>
      </Modal>

      <Modal 
        title={items != null ? "Update Data" : "New Date"} 
        open={isModalOpen} 
        onOk={() => {
          form.resetFields()
          handleOk()
        }} 
        onCancel={() => {
          form.resetFields()
          handleOk()
        }}
        footer={null}
        >
        <Form
          form={form}
          onFinish={(item) => {
            form.resetFields()
            handleSaveImages(item)
          }}
          layout="vertical"
        >
          <Form.Item label="Image">
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

          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button
                danger
                onClick={() => {
                  handleOk()
                  form.resetFields()
                }}
              >
                Cancel
              </Button>
              <Button htmlType='submit'>{items != null ? "Update" : "Save"}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

  </>
  )
}
export default MultipleImage;

// ======================================================================

