const result = fetch("http://localhost:8080/api/repos")
  .then((response) => response.json())
  .then((data) => {
    return data;
  });

const getResult = async () => {
  const a = await result;
  console.log(a);
  console.log("Array dimension: " + a.length);
  document.getElementById("link-1").href = a[1].html_url;
  document.getElementById("project-1").innerHTML = a[1].name;
  document.getElementById("language-1").innerHTML = a[1].language;
  document.getElementById("stars-1").innerHTML = a[1].stargazers_count;
  document.getElementById("watchers-1").innerHTML = a[1].watchers_count;
  document.getElementById("description-1").innerHTML = a[1].description;
  document.getElementById("link-2").href = a[2].html_url;
  document.getElementById("project-2").innerHTML = a[2].name;
  document.getElementById("language-2").innerHTML = a[2].language;
  document.getElementById("stars-2").innerHTML = a[2].stargazers_count;
  document.getElementById("watchers-2").innerHTML = a[2].watchers_count;
  document.getElementById("description-2").innerHTML = a[2].description;
};

getResult();