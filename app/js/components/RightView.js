'use strict';
import React from 'react';
import Reflux from 'reflux';
import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';
import Grid from './Grid';
import GridInner from './GridInner';
import ViewFieldView from './ViewFieldView';
import RowLayout from './RowLayout';
import DropCompontDiv from './DropCompontDiv';
import classNames from 'classnames';
import {Paper, RaisedButton, FlatButton} from 'material-ui';

/**
 右侧视图组件
*/
let RightView = React.createClass({
	// 监听 数据
	mixins: [Reflux.listenTo(AppStore, 'onStatusChange')],
	// 初始化 状态 数据
	getInitialState: function() {
		return {
			bootstrapData:[]
		};
	},
	// 数据源 发生变化的时候
	onStatusChange:function(data){
		this.setState({
			bootstrapData: data.bootstrapData
		});
		this.saveJson();
	},
	// 组件装载的时候
	componentDidMount: function() {
		AppActions.getAll();
	},
	render : function(){
		let nodatahtml = (<div className='fb-no-response-fields'>No response fields</div>);
		if(this.state.bootstrapData.length > 0){
			nodatahtml = '';
		}
		let viewnodes = [];
		this.state.bootstrapData.map((item, rowindex) => {
			let columns = [];
			// 将布局的样式属性
			// let stylecss = {};
			// stylecss.minHeight = item.
			item.columns.map((column, colindex) =>{
				// 每列容器的样式
				let stylecss = {};
				stylecss.minHeight = column.properties.minheight;
				stylecss.col = column.properties.col;
				let viewfieldviews = [];
				column.fields.map(function(field){
					viewfieldviews.push(<ViewFieldView {...field}/>);
				});
				let giclassnames = '';
				if(viewfieldviews.length <= 0){
					giclassnames = classNames(giclassnames, 'gridinner-empty');
				}
				columns.push(
					<GridInner {...stylecss} className={giclassnames} >
						<DropCompontDiv rowindex={rowindex} colindex={colindex} >
							{viewfieldviews}
						</DropCompontDiv>
					</GridInner>
				);
			});
			viewnodes.push(
				<Grid cid={item.cid} >
					{columns}
				</Grid>
			);
		});
		let papertopstyle={
			backgroundColor:'#00bad4',
			marginTop:'-10px',
			marginLeft:'-15px',
			marginRight:'-15px',
			marginBottom:'10px',
			height:'48px'
		}
		return (
				<div>
					<Paper style={papertopstyle}>
						<FlatButton label="保存"  onClick={this.saveJson}
						style={{height:'48px',backgroundColor:'#00bad4',float:'right',marginRight:'10px'}}/>
					</Paper>
					<RowLayout >
						{nodatahtml}
						{viewnodes}
					</RowLayout>
				</div>
		);
	},
	saveJson:function(){
		AppStore.saveJson();
	}
});
export default RightView;
