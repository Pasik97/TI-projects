<?php

require_once ("rest.php");
require_once ("database.php");

class API extends REST {

  public $data = "";
  protected $sessionid = "";

  public function __construct(){
    parent::__construct();
    $this->sessionid = $_SERVER['HTTP_AUTHENTICATE'];
    $this->db = new db() ;
  }


  public function processApi(){

    $func = "_".$this->_endpoint ;
    if ((int)method_exists($this,$func) > 0) {
      $this->$func();
    }
    else {
      $this->response('Page not found',404);
    }
  }


  private function hasNeededKeys($array, $lookedArray) {
    foreach ($array as $key) {
      if (!array_key_exists($key, $lookedArray))
        return false;
    }
    return true;
  }


  private function returnStatus($status) {
    $array = array('status' => $status);
    $this->response($this->json($array), 200);
  }


  private function _checkSession() {
    if ($this->get_request_method() != "POST") {
      $this->response('',406);
    }
    if (!empty($this->_request)) {
      try {
        $json_array = json_decode($this->_request, true);
        $json_array['login'] = strtolower($json_array['login']);
        $result = $this->db->checkSession($json_array['sesja']);
        if ($result) {
          $this->response($this->json($result), 200);
        }
        else {
          $this->response('{"id":"0"}', 200);
        }
      }
      catch (Exception $e) {
        $this->response('', 400);
      }
    }
  }


  private function _login()
  {
      if($this->get_request_method() != "POST")
          $this->response('',406);
      if(!empty($this->_request) )
      {
          try
          {
              $json_array = json_decode($this->_request,true);

              foreach ($json_array as $key => $value)
              {
                  if ($value == '')
                  {
                      $result = array('status'=>'failed', 'msg' => 'missed data');
                      $this->response($this->json($result), 400);
                  }
              }

              $res = $this->db->login($json_array);
              if ( $res )
              {
                  $result = array('status'=>'ok', 'sessionID'=>$res);
                  $this->response($this->json($result), 200);
              }
              else
              {
                  $result = array('status'=>'wrong login or password');
                  $this->response($this->json($result), 200);
              }
          } catch (Exception $e)
          {
              $error = array('status' => "failed", "msg" => "exception");
              $this->response($this->json($error), 400);
          }
      }
      else
      {
          $error = array('status' => "failed", "msg" => "invalid data");
          $this->response($this->json($error), 400);
      }
  }


  private function _logout() {
    if ($this->get_request_method() != "POST") {
      $this->response('',406);
    }
    if (!empty($this->_request)) {
      try {
        $json_array = json_decode($this->_request, true);
        $result = $this->db->logout($json_array['sesja']);
        $this->response($this->json($result), 200);
      }
      catch (Exception $e) {
        $this->response('', 400);
      }
    }
  }


  private function _getRatings() {
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->getRatings();
    $this->response($this->json($result), 200);
  }


  private function _getAvgRatings() {
    if ($this->get_request_method() != "GET") {
      $this->response('',406);
    }
    $result = $this->db->getAvgRatings();
    $this->response($this->json($result), 200);
  }


  private function _addRating() {
    if($this->get_request_method() != "POST")
        $this->response('',406);

    if(!empty($this->_request) )
    {
        try
        {
            $json_array = json_decode($this->_request,true);

            $res = $this->db->addRating($json_array);
            if ( $res )
            {
                $result = array('status'=>'ok');
                $this->response($this->json($result), 200);
            }
            else
            {
                $result = array('status'=>'not add');
                $this->response($this->json($result), 200);
            }
        } catch (Exception $e)
        {
            $error = array('status' => "failed", "msg" => "exception");
            $this->response($this->json($error), 400);
        }
    }
    else
    {
        $error = array('status' => "failed", "msg" => "invalid data");
        $this->response($this->json($error), 400);
    }
  }

  private function json($data){
    if(is_array($data)){
      return json_encode($data);
    }
  }
}

$api = new API;
$api->processApi();

?>
