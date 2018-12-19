# vue-node-express

## vue + node + express + mongoose

## issue001: mongoose对象不能添加属性的问题
	原因: mongoose对象与js对象还是有区别的;在Schma数据结构中如果没有设计对应的属性,则mongoose对象是无法添加属性的
	解决方案: 1, 在对应的Schema中添加相应的字段
			2, clone一个mongoose对象,由克隆对象就是一个js对象,就可以添加属性
## issue002: 在数据库中,新建一个文档对象的时候,mongoose数据库会自动添加_v的字段,这是标识文档的版本号,如果想要该字段消失,可以在Schema中配置{versionKey: false}即可