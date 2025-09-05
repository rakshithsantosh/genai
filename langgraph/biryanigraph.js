/**
 * cut the vegetables
 *
 */

import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";

function cutVegetables(state) {
  console.log("Cutting vegetables...");
  return state;
}

function boilVegetables(state) {
  console.log("Boiling vegetables...");
  return state;
}

function addSpices(state) {
  console.log("Adding spices...");
  return state;
}

function tasteDish(state) {
  console.log("Tasting the dish...");
  return state;
}

function isDishTasty() {
  if (true) {
    return "__end__";
  } else {
    return "addSpices";
  }
}

const graph = new StateGraph(MessagesAnnotation)
  .addNode("cutVegetables", cutVegetables)
  .addNode("boilVegetables", boilVegetables)
  .addNode("addSpices", addSpices)
  .addNode("tasteDish", tasteDish)
  .addEdge("__start__", "cutVegetables")
  .addEdge("cutVegetables", "boilVegetables")
  .addEdge("boilVegetables", "addSpices")
  .addEdge("addSpices", "tasteDish")
  .addConditionalEdges("tasteDish", isDishTasty);

const biryani = graph.compile();

async function main() {
  const finalState = await biryani.invoke({
    messages: [],
  });

  console.log("Final State:", finalState);
}

main();
