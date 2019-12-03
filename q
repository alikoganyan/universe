warning: LF will be replaced by CRLF in src/common/Company.js.
The file will have its original line endings in your working directory
warning: LF will be replaced by CRLF in src/screens/NewFeed/Content.js.
The file will have its original line endings in your working directory
[1mdiff --git a/src/common/Company.js b/src/common/Company.js[m
[1mindex f3c11475..17153cc1 100644[m
[1m--- a/src/common/Company.js[m
[1m+++ b/src/common/Company.js[m
[36m@@ -185,7 +185,6 @@[m [mclass Company extends Component {[m
         this.props.setContacts(res.data.contacts)[m
         this.props.setNews(res.data.news)[m
         this.props.setReset(true)[m
[31m-        this.props.setReceivers([])[m
       },[m
       full_res: true,[m
     })[m
[36m@@ -222,7 +221,6 @@[m [mconst mapDispatchToProps = dispatch => ({[m
   setCompanies: _ => dispatch(setCompanies(_)),[m
   setUser: _ => dispatch(setUser(_)),[m
   setReset: _ => dispatch(setReset(_)),[m
[31m-  setReceivers: _ => dispatch(setFeedReceivers(_)),[m
 })[m
 [m
 export default connect([m
[1mdiff --git a/src/screens/NewFeed/Content.js b/src/screens/NewFeed/Content.js[m
[1mindex c2055043..5702f93f 100755[m
[1m--- a/src/screens/NewFeed/Content.js[m
[1m+++ b/src/screens/NewFeed/Content.js[m
[36m@@ -152,6 +152,10 @@[m [mclass Content extends Component {[m
 [m
   componentDidMount() {}[m
 [m
[32m+[m[32m  componentWillUnmount(): void {[m
[32m+[m[32m    this.props.setReceivers([])[m
[32m+[m[32m  }[m
[32m+[m
   deleteReceiver = e => {[m
     const { _id } = e[m
     const { receivers, setFeedReceivers } = this.props[m
[36m@@ -222,6 +226,7 @@[m [mconst mapDispatchToProps = dispatch => ({[m
   setUser: _ => dispatch(setUser(_)),[m
   addFeed: _ => dispatch(addFeed(_)),[m
   setFeedReceivers: _ => dispatch(setFeedReceivers(_)),[m
[32m+[m[32m  setReceivers: _ => dispatch(setFeedReceivers(_)),[m
 })[m
 export default connect([m
   mapStateToProps,[m
