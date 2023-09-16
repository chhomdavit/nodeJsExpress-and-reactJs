import {useState,useEffect} from 'react';
import {request} from "../../util/api";
import {formatDateForClient,Config} from '../../util/service';
import Container from '../container/Container'
import {Typography,Image, Col, Row, Button, Space, Table, message, Popconfirm} from "antd";
import {DeleteFilled,EditFilled} from '@ant-design/icons';
import ModalForm from './ModalForm'
const { Paragraph ,Text} = Typography;

const Product = () => {
  const [listProduct, setListProduct] = useState([]);
  const [listProductImage, setListProductImage] = useState([]);
  const [listCategory, setListCategory] = useState([])
  const [visibleModel, setVisibleModel] = useState(false);
  const [loading,setLoading] = useState(false)

  const [items, setItems] = useState(null);
  const [imageFiles,setImageFiles] = useState(null);
  const [pictures, setPictures] = useState(null);
  const [ellipsis] = useState(true);

  useEffect(()=>{
    getListProduct();
  },[])
  
  const onClickBtnAddNew = () =>{
    setVisibleModel(true)
  }

  const onClickDelete = ()=>{
    setVisibleModel(false)
    setItems(null)
    setPictures(null)
    setImageFiles(null)
  }

  const onChangeFile = (event) =>{
    setImageFiles(event.target.files)
    
    const tempArr = [];
    [...event.target.files].forEach((file) => {
      tempArr.push({
        data: file,
        url: URL.createObjectURL(file),
      });
    });
    setPictures(tempArr);
  }

  const onClickEdit = (param) => {
    setItems(param)
    setVisibleModel(true)
  }

  const onFinish = (item) => {
    setLoading(true)
    setVisibleModel(false);
    setPictures(null)
    setImageFiles(null)

    var form = new FormData()

    form.append('product_name', item.product_name)
    form.append('category_id', item.category_id)
    form.append('product_barcode', item.product_barcode)
    form.append('product_price', item.product_price)
    form.append('product_quantity', item.product_quantity)
    form.append('product_desc', item.product_desc)
    form.append('product_status', item.product_status)
    form.append('create_by', item.create_by)

    if (imageFiles == null || imageFiles.length === 0) {
      console.log("No images uploaded");
    } else {
      for (var i = 0; i < imageFiles.length; i++) {
        form.append("images", imageFiles[i], imageFiles[i].filename)
      }
    }
    var method = "post"
    var url = 'product/create'
    if(items !=null){
       method = "put"
       url = 'product/update'
       form.append('product_id',items.product_id)
    }
    request(method, url, form).then(res => {
      if(res.status === 200){
        message.success(res.data.message);
        getListProduct();
        setItems(null)
        setLoading(false)
      }
    })
  }

  const getListProduct = () => {
    setLoading(true)
    request('get', 'product/getListProduct', {}).then(res => {
      setLoading(false)
      if (res.status){
        var data = res.data
        setListProduct(data.list_product)
        getListProductImages(data?.list_product[0]?.product_id)

        var arrTmp = []
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

  const getListProductImages =(id)=>{
    setLoading(true)
    request('get', 'product/getListProductImage/' + id, {}).then(res => {
      var data = res.data
      if (data && !data.errorTwo) {
        setListProductImage(data.list_productImage)
        setLoading(false)
      }
    })
  }

  const onClickDeleteProductImages = (id) =>{
    request("delete","product/removeProductImage/"+id,{}).then(res=>{
      if(res.status === 200){
          message.success(res.data.message)
          getListProduct();
      }
  })
  }

  const onClickDeleteProduct = (id) =>{
    request("delete","product/remove/"+id,{}).then(res=>{
      if(res.status === 200){
          message.success(res.data.message)
          getListProduct();
      }
  })
  }
  return (
    
    <Container
    loading={loading}
    pageTitle="Product"
    btnRight="New Product"
    onClickBtnAddNew={onClickBtnAddNew}
    search={{
        title: 'Product Name',
        allowClear: true
    }}
    >
      <Row gutter={19}>
          <Col span={18}>
            <Table
              dataSource={listProduct}
              size="small"
              scroll={{
                x: 1300,
              }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => {
                    getListProductImages(record.product_id)
                  }
                };
              }}
              columns={[
                {
                  title: "No",
                  fixed: 'left',
                  width:'60px',
                  render: (value, record, index) => (index + 1)
                },
                {
                  title: "ឈ្មោះ",
                  dataIndex: "product_name",
                  key: "product_name",
                  fixed: 'left',
                },
                {
                  title: "ប្រភេទ",
                  width:'130px',
                  dataIndex: "category_name",
                  key: "category_name",
                },
                {
                  title: "Barcode",
                  dataIndex: "product_barcode",
                  key: "product_barcode",
                },
                {
                  title: "តម្លៃ",
                  dataIndex: "product_price",
                  key: "product_price",
                  render: (item,items,index)=><p style={{ color:"red" }}>{item}&nbsp;$</p>     
                },
                {
                  title: "បរិមាណ",
                  dataIndex: "product_quantity",
                  key: "product_quantity",
                  render: (item,items,index)=><p style={{ color:"green" }}>{item}&nbsp;Qty</p>
                },
                {
                  title: "Description",
                  dataIndex: "product_desc",
                  key: "product_desc",
                  width:'250px',
                  render: (item,items,index)=>
                    <Paragraph 
                      ellipsis={ellipsis ? { rows: 2, expandable: true, symbol: 'more' } : false}
                    >
                      {item}
                    </Paragraph>
                },
                {
                  title: "Status",
                  dataIndex: "product_status",
                  key: "product_status",
                  render: (item,items,index)=>
                          item === 0 ? 
                          <p style={{ color:"red" }}>Out Stock</p> 
                          : 
                          <p style={{ color:"green" }}>In Stock</p>
                },
                {
                  title: "Main Images",
                  key: "images",
                  dataIndex: 'images',
                  render: (item) => {
                    return (
                      <Image
                        width={80}
                        height={60}
                        src={Config.imagePath + item}
                        alt={item}
                      />
                    )
                  }
                },
                {
                  title: "create_at",
                  dataIndex: "create_at",
                  key: "create_at",
                  render: (item,items,index)=>formatDateForClient(item)
                },
                {
                  title: "create_by",
                  width:'130px',
                  dataIndex: "admin_name",
                  key: "admin_name",
                  render: (item,items,index)=><Text code>{item}</Text>
                },
                {
                  title: "Action",
                  key: "Action",
                  width:'85px',
                  fixed: 'right',
                  render: (item, items, index) => {
                    return (
                      <Space>
                        <Popconfirm
                          placement="topLeft"
                          title={"Delete"}
                          description={"Are sure to romove!"}
                          onConfirm={() => onClickDeleteProduct(items.product_id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button size='small' danger><DeleteFilled /></Button>
                        </Popconfirm>

                        <Button onClick={() => onClickEdit(items)} size='small' type="primary" ><EditFilled /></Button>
                      </Space>
                    )
                  }
                },
              ]}
            />
          </Col>

          <Col span={6}>
            <Row justify="start">
              <Col span={24}>
                <Table
                  dataSource={listProductImage}
                  size="small"
                  columns={[
                    {
                      title: "No",
                      render: (value, record, index) => (index + 1)
                    },
                    {
                      title: "All Images",
                      key: "images",
                      dataIndex: 'images',
                      render: (item) => {
                        return (
                          <Image
                            width={80}
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
                          <Popconfirm
                            placement="topLeft"
                            title={"Delete"}
                            description={"Are sure to romove!"}
                            onConfirm={() => onClickDeleteProductImages(items.image_id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button size='small' danger><DeleteFilled /></Button>
                          </Popconfirm>
                        )
                      }
                    },
                  ]}
                />
              </Col>
            </Row>
          </Col>
      </Row>
      
      {/* <Row>
        {listProduct.map(item => {
          return (
            <Col xs={12} sm={12} md={6} lg={4} className="g-4" key={item}>
              <Card
                hoverable
                style={{ width: "100%", height: 430 }}
                cover={<Image alt="example" src={Config.imagePath + item.images} style={{ height: 250, padding: 30, backgroundColor: "#f5f5f5" }} />}
              >
                <h3>{item.name}</h3>
              </Card>
            </Col>
          )
        })}
      </Row> */}

      <ModalForm
        items={items}
        title={items != null ? "Update Product" : "New Product"}
        open={visibleModel}
        onCancel={onClickDelete}
        onFinish={onFinish}
        onChangeFile={onChangeFile}
        listCategory={listCategory}
        pictures={pictures}
      />
    </Container>
  );
}

export default Product
