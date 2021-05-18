## generate `default.json`

-   commenting lines in the function `get_score` in file `service.py`
-   start backend server. `python run.py`
-   ```bash
    curl "http://localhost:5000/server/v1/scores?ligands=&receptors=&interactions=&tumors=" > default.json
    ```
