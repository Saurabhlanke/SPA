import React from "react";
import { View, Text, Image, Button, StyleSheet, FlatList } from "react-native";



const CustomTable = (props) => {
  const { url, id, title } = props.data
  return (
    <View style={{ flexDirection: 'row', borderWidth: 0.4 }}>
      <View style={[tableStyles.columnStyle, { flex: 2 }]}>
        {url && <Image style={{ height: 50, width: 80 }} source={{ uri: url }} />}
      </View>
      <View style={[tableStyles.columnStyle, { flex: 1 }]}>
        <Text > {id ?? "ID"}</Text>

      </View>
      <View style={[tableStyles.columnStyle, { flex: 2 }]}>
        <Text numberOfLines={3} >{url ?? "URL"}</Text>
      </View>
      <View style={[tableStyles.columnStyle, { flex: 3 }]}>
        <Text numberOfLines={3} >{title ?? "TITLE"}</Text>
      </View>
    </View>
  )

}


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      tableData: []
    }
  }


  componentDidMount = () => {
    this.getImagesData()
  }

  /**
   * 
   * @param {*} key to update an array values for comparison 
   */
  updateData = (key) => {
    let imagesTemp = this.state.images.map((index, i) => index.id == key ? { ...index, isCompared: !index.isCompared } : { ...index })
    let tableDataTemp = imagesTemp.filter((index) => index.isCompared == true)
    this.setState({ images: imagesTemp, tableData: tableDataTemp })
  }

  /**
   * For AJAX calls
   */
  getImagesData = async () => {

    try {

      const response = await fetch('https://jsonplaceholder.typicode.com/photos', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      });

      let imagesTemp = await response.json()

      imagesTemp.map((index) => {
        index.isCompared = false
      })

      this.setState({ images: imagesTemp })

    }
    catch (error) {
      console.log(error)
    }

  }

  renderItem = (data) => {
    const { url, id, title, isCompared } = data.item
    return (
      <View style={[tableStyles.cardStyle]}>
        <Image style={{ height: 70, width: 100 }} source={{ uri: url }} />
        <Text numberOfLines={3} style={{ paddingTop: 10 }}>{title}</Text>
        <Text style={{ paddingTop: 10 }}>{id}</Text>
        <Text numberOfLines={3} style={{ paddingVertical: 10 }}>{url}</Text>
        <Button
          color={isCompared ? "#ff5c5c" : "#008000"}
          onPress={() => this.updateData(id)}
          title={isCompared ? "Remove" : "Compare"} />
      </View>
    )
  }

  renderTable = (data) => {
    return (
      <CustomTable data={data} />
    )
  }

  render() {
    const { images, tableData } = this.state
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <View>
          <FlatList
            horizontal
            data={images}
            renderItem={(item) => this.renderItem(item)}
            keyExtractor={(item, index) => index} />
        </View>
        <View style={{ paddingTop: 10 }}>
          <View style={[tableStyles.tableHeader]}>
            <Text>Comparison Table</Text>
          </View>
          <CustomTable data={{ uri: "URI", id: "ID", title: "TITLE" }} />
          <FlatList
            data={tableData}
            renderItem={(index) => this.renderTable(index.item)}
            keyExtractor={(item, index) => index} />
        </View>

      </View>
    )
  }
}

const tableStyles = StyleSheet.create({
  columnStyle: { borderWidth: 0.5, justifyContent: 'center', alignItems: 'center', paddingVertical: 5 },
  cardStyle: { width: 150, alignItems: 'center', borderWidth: 0.4, padding: 10, marginRight: 5 },
  tableHeader: { width: "100%", borderWidth: 1, paddingVertical: 10, justifyContent: 'center', alignItems: 'center' }
})