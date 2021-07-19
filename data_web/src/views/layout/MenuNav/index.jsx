import React, {Component} from 'react';
import './index.css'
import { Menu } from 'antd';
import AWeekAQuestionDefault from "../../../assets/images/a-week-a-question-default.png"
// import AWeekAQuestionSelect from "../../../assets/images/a-week-a-question-select.png"
import QuestionListDefault from "../../../assets/images/question-list-default.png"
// import QuestionListSelect from "../../../assets/images/question-list-select.png"
import SubmitAnswerDefault from "../../../assets/images/submit-question-default.png"
// import SubmitAnswerSelect from "../../../assets/images/submit-question-select.png"
import Logo from "../../../assets/images/logo.png"
class MenuNav extends Component {
    state ={
        current: 'a-week-a-question'
    }
    render() {
        const {current} = this.state
        return (
            <div className="menu-wrapper">
                <div className="main center">
                    <div className="logo">
                        <img src={Logo} alt="logo" className="logo"/>
                    </div>
                    <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
                        <Menu.Item key="a-week-a-question" icon={<img className="menu-icon" src={AWeekAQuestionDefault} alt=""/>}>
                            每日一提
                        </Menu.Item>
                        <Menu.Item key="question-list" icon={<img className="menu-icon"  src={QuestionListDefault} alt=""/>}>
                            问题列表
                        </Menu.Item>
                        <Menu.Item key="submit-question" icon={<img className="menu-icon"  src={SubmitAnswerDefault} alt=""/>}>
                            提交问题
                        </Menu.Item>
                    </Menu>
                </div>
            </div>
        );
    }
}

export default MenuNav;