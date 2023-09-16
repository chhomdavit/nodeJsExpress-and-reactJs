import { useEffect } from 'react';
import { Button, Col,  ConfigProvider,  DatePicker,  Divider, Form, Image, Input, Modal, Radio, Row, Space } from 'antd';
import{Config} from '../../util/service'
import 'dayjs/locale/en'
import React from 'react';
import dayjs, { locale } from 'dayjs';



const ModelForm = ({
    title=null,
    open=false,
    onCancel,
    onFinish,
    onChangeImage,
    imgFile,
    onChangeDay,
    dob,
    onOk,
    items,
    footer=null
}) => {
    const [form] =Form.useForm()
    
    useEffect(() => {
        if (items != null) {
            form.setFieldsValue({
                firstname: items.firstname,
                lastname: items.lastname,
                gender: items.gender,
                // dob: items.dob,
                user_email: items.user_email,
                telephone: items.telephone,
                // password: items.password,
                is_active: items.is_active,
            });
        }
    }, [items, form]);

  return (
    <Modal
     title={title}
     open ={open}
     onOk={onOk}
     onCancel={()=>{
        onCancel()
        form.resetFields()
     }}
     footer={footer}
     width={'60%'}
    >
        <Divider/>
        <Form 
            form={form} 
            layout='vertical' 
            onFinish={(item=>{
                form.resetFields() 
                onFinish(item)})}
            initialValues={{ 
                gender:0,
                is_active:0,
             }}
        >

            <Row gutter={10}>
                <Col span={12}>
                      <Form.Item
                          label="Firstname"
                          name={'firstname'}
                          rules={[{ required: true, message: 'Please fill in firstname' }]}
                      >
                          <Input placeholder='Firstname' />
                      </Form.Item>
                </Col>
                <Col span={12}>
                      <Form.Item
                          label="Lastname"
                          name={'lastname'}
                          rules={[{ required: true, message: 'Please fill in lastname' }]}
                      >
                          <Input placeholder='Lastname' />
                      </Form.Item>
                </Col>
            </Row>

            <Row gutter={10}>
                <Col span={12}>
                      <Form.Item
                          label="Gender"
                          name={'gender'}
                      >
                          <Radio.Group>
                            <Radio value={1}>Male</Radio>
                            <Radio value={0}>Female</Radio>
                          </Radio.Group>
                      </Form.Item>
                </Col>
                <Col span={12}>
                      {/* <Form.Item
                          label="ថ្ងៃ-ខែ-ឆ្នាំ-កំណើត"
                          name={'dob'}
                      >
                        <ConfigProvider locale={locale}>
                              <DatePicker
                                  style={{ width: '100%' }}
                                  placement='BottomLeft'
                                  placeholder='ថ្ងៃ-ខែ-ឆ្នាំ-កំណើត'
                                  format={'DD-MM-YYYY'}
                                  value={dayjs(dob, "YYYY-MM-DD")}
                                  onChange={onChangeDay}
                              />
                          </ConfigProvider>
                      </Form.Item> */}
                      
                          <Form.Item label='ថ្ងៃ-ខែ-ឆ្នាំ-កំណើត' name={dob}>
                          <ConfigProvider locale={locale}>
                              <DatePicker
                                  style={{ width: '100%' }}
                                  placement='BottomLeft'
                                  placeholder='ថ្ងៃ-ខែ-ឆ្នាំ-កំណើត'
                                  format={'DD-MM-YYYY'}
                                  value={dob !=null ? dayjs(dob, "DD-MM-YYYY") : dayjs(items.dob, "DD-MM-YYYY")}
                                  onChange={onChangeDay}
                              />
                              </ConfigProvider>
                          </Form.Item>
                      
                </Col>
            </Row>

            <Row gutter={10}>
                <Col span={12}>
                      <Form.Item
                          label="User Email"
                          name={'user_email'}
                          rules={[{ required: true, message: 'Please fill in user_email' }]}
                      >
                          <Input placeholder='User Email' />
                      </Form.Item>
                </Col>
                <Col span={12}>
                      <Form.Item
                          label="Password"
                          name={'password'}
                          rules={[{ required: true, message: 'Please fill in password' }]}
                      >
                          <Input.Password placeholder='Password' />
                      </Form.Item>
                </Col>
            </Row>

            <Row gutter={10}>
                  <Col span={12}>
                      <Form.Item
                          label="Telephone"
                          name={'telephone'}
                      >
                          <Input placeholder='Telephone' />
                      </Form.Item>
                  </Col>
                  <Col span={12}>
                      <Form.Item
                          label="is_active"
                          name={'is_active'}
                      >
                          <Radio.Group>
                            <Radio value={1}>None_Admin</Radio>
                            <Radio value={0}>Admin</Radio>
                          </Radio.Group>
                      </Form.Item>
                  </Col>
                  <Col span={24}>
                      <Form.Item
                          label="Upload Image"
                          name={'image_admin'}
                      >
                          <Input type='file' onChange={onChangeImage} placeholder='image_admin' />
                          <br/>
                          {imgFile != null ? <Image src={imgFile} alt={imgFile} style={{ width: 100, height: 70 }} />
                              :
                              <div>
                                  {items && <Image src={Config.imagePath + items.image_admin} alt={items.image_admin} style={{ width: 150, height: 150 }} />}
                              </div>
                          }
                      </Form.Item>
                  </Col>
            </Row>
    
            <Form.Item style={{ textAlign:'right' }}>
            <Space>
                <Button 
                    danger
                    onClick={()=>{
                        onCancel() 
                        form.resetFields()}}
                >
                    Cancel
                </Button>
                <Button htmlType='submit'>{items !=null ? "Update" : "Save"}</Button>
            </Space>
            </Form.Item>
            
        </Form>
    </Modal>
  )
}

export default ModelForm;
