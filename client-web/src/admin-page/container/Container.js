import {useState} from 'react';
import "./Container.css"
import { Button, Input, Spin,Affix } from "antd"
import { isEmptyOrNull } from "../../util/service"

const Container = ({
    pageTitle = "PageTitle",
    loading = false,
    btnRight = false,
    onClickBtnAddNew,
    children,

    search={
        title:"Name",
        size:"middle",
        allowClear:true
    },
    onSearch
}) => {
    const [top] = useState(80);
    return (
        <div>
            {/* header */}
            <Affix offsetTop={top}>
                <div className="pageHeaderContainer">
                    <div className="rowHeader">
                        <div style={{
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            fontSize: "20px"
                        }}>{pageTitle}</div>

                        {search != null && <div className="filterContent">
                            <Input.Search
                                placeholder={search.title}
                                size={search.size}
                                onSearch={onSearch}
                                allowClear={search.allowClear}
                            />
                        </div>}
                    </div>
                    <div>
                        {!isEmptyOrNull(btnRight) &&
                            <Button type="primary" onClick={onClickBtnAddNew}>
                                {btnRight}
                            </Button>
                        }
                    </div>
                </div>
            </Affix>

            {/* body */}
            <Spin spinning={loading}>
                {children}
            </Spin>
        </div>
    )
}

export default Container