import { Button,  Form, Image, Input,  Modal, Space, Row, Col, Radio, Select, InputNumber} from "antd"
import {useEffect} from 'react';


const ModalForm = ({
    open=false,
    title=null,
    footer=null,
    onCancel,
    onOk,
    onFinish,
    onChangeFile,
    listCategory,
    items,
    pictures,
}) => {
    const [form] = Form.useForm() 

    useEffect(()=>{
        if(items != null){
            form.setFieldsValue({
                product_name : items.product_name,
                category_id : items.category_id,
                product_barcode : items.product_barcode,
                product_price : items.product_price,
                product_quantity : items.product_quantity,
                product_desc : items.product_desc,
                product_status : items.product_status,
                create_by : items.create_by,
            })
        }
    },[items,form])

    const handleCancel = () => {
        form.resetFields() 
        onCancel()
    }

    return (
        <Modal
            open={open}
            title={title}
            onCancel={handleCancel}
            onOk={onOk}
            footer={footer}
            maskClosable={false}
            width={"50%"}
            
        >
            <Form
                encType="multipart/form-data"
                form={form}
                name="form_product"
                layout='vertical'
                onFinish={(item) => {
                    form.resetFields()
                    onFinish(item)
                }}
                initialValues={{ product_status:1}}
            >

                <Row gutter={10}>
                    <Col span={12}>
                        <Form.Item
                            label="product_name"
                            name={'product_name'}
                            rules={[{ required: true, message: 'Please fill in product_name' }]}
                        >
                            <Input placeholder='product_name' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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
                    </Col>
                </Row>

                <Row gutter={10}>
                    <Col span={12}>
                        <Form.Item
                            label="product_barcode"
                            name={'product_barcode'}
                            rules={[{ required: true, message: 'Please fill in product_barcode' }]}
                        >
                            <Input placeholder="Product Barcode" disabled={items !=null ? true : false} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="product_price"
                            name={'product_price'}
                            rules={[{ required: true, message: 'Please fill in product_price' }]}
                        >
                            <InputNumber placeholder='product_price' style={{ width:'100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={10}>
                    <Col span={12}>
                        <Form.Item
                            label="product_quantity"
                            name={'product_quantity'}
                            rules={[{ required: true, message: 'Please fill in product_quantity' }]}
                        >
                            <Input placeholder='product_quantity' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Status"
                            name={'product_status'}
                            rules={[{ required: true, message: 'Please fill in product_status' }]}
                        >
                            <Radio.Group>
                                <Radio value={0}>Out Stock</Radio>
                                <Radio value={1}>In Stock</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                
                <Form.Item
                    label="product_desc"
                    name={'product_desc'}
                    rules={[{ required: true, message: 'Please fill in product_desc' }]}
                >
                    <Input.TextArea placeholder='product_desc' />
                </Form.Item>

                <Form.Item
                    label="Upload Images"
                    name={'images'}
                    >
                     <Input
                        type='file'
                        multiple={true}
                        onChange={onChangeFile}
                    />
                    <br />
                    {pictures?.map((pic) => (
                        <Image
                            style={{ width: 150, height: 100 }}
                            src={pic.url}
                            alt={pic.data.name} />
                    ))}
                </Form.Item>

                <Form.Item style={{ textAlign: 'right' }}>
                    <Space>
                        <Button type="primary" htmlType="submit">{items !=null ? 'Update': 'Save'}</Button>
                        <Button onClick={() => {
                            form.resetFields()
                            onCancel()}}
                        >
                            Cancel
                        </Button>

                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalForm;